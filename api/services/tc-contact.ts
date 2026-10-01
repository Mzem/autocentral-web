import { TC_MERCHANT_ID, TC_PHONE } from '../../app/_lib/site'

/**
 * Tunisian Cars has ONE public number (98 192 053). The former sales line
 * (24 660 559) must not appear anywhere on either site, but it still lives in
 * the data the API returns for the showroom: it is the merchant's first phone,
 * the posts' WhatsApp number, and it is written in the text of most listings
 * scraped from the Facebook page ("☎️ 24 660 559").
 *
 * So every car-post / merchant read goes through these helpers, which swap it
 * for the current number at read time (front only - nothing is persisted, and a
 * later re-scrape can't bring the old number back on screen).
 */
const OLD_NUMBER_RE = /(?:(?:\+|00)?216[\s.-]?)?24[\s.-]?660[\s.-]?559/g

export function scrubOldNumber<T extends string | null | undefined>(
  text: T
): T {
  if (!text) return text
  return text.replace(OLD_NUMBER_RE, TC_PHONE.display) as T
}

type PostLike = {
  merchant?: { id?: string; phone?: string } | null
  isOnBehalf?: boolean
  phone?: string
  phones?: string[]
  whatsapp?: string | number
  title?: string
  description?: string
}

/**
 * Showroom posts (merchant `tunisian-cars`) always show the Tunisian Cars
 * number. On-behalf listings keep their owner's own number (that is the whole
 * point of them); only the merchant reference and the text are cleaned.
 * Posts from any other seller are returned untouched.
 */
export function withTcContact<T>(post: T): T {
  const p = post as T & PostLike
  if (!p || p.merchant?.id !== TC_MERCHANT_ID) return post

  const out: PostLike = {
    ...p,
    merchant: { ...p.merchant, phone: TC_PHONE.e164 }
  }
  if (typeof p.title === 'string') out.title = scrubOldNumber(p.title)
  if (typeof p.description === 'string')
    out.description = scrubOldNumber(p.description)
  if (!p.isOnBehalf) {
    out.phone = TC_PHONE.e164
    out.phones = [TC_PHONE.e164]
    if (p.whatsapp !== undefined && p.whatsapp !== null)
      out.whatsapp = TC_PHONE.intl
  }
  return out as T
}

type MerchantLike = {
  id?: string
  phone?: string
  phones?: string[]
  description?: string
}

/** Same rule for the seller record itself (seller page / sellers list). */
export function withTcMerchantContact<T>(merchant: T): T {
  const m = merchant as T & MerchantLike
  if (!m || m.id !== TC_MERCHANT_ID) return merchant
  return {
    ...m,
    phone: TC_PHONE.e164,
    phones: [TC_PHONE.e164],
    ...(typeof m.description === 'string'
      ? { description: scrubOldNumber(m.description) }
      : {})
  } as T
}
