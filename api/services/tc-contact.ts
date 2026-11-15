import {
  type ContactNumber,
  FEATURED_CONTACTS,
  TC_MERCHANT_ID,
  TC_PHONE
} from '../../app/_lib/site'

/**
 * Contact numbers are decided at read time (front only - nothing is persisted,
 * and a re-scrape can't change what is shown):
 *
 *  - Listings of the featured sellers (Tunisian Cars, Best Auto) are answered
 *    on the sales line 24 660 559 (FEATURED_CONTACTS): calls + WhatsApp.
 *  - The Tunisian Cars seller record keeps the site number (98 192 053); the
 *    sales line written in its description is swapped for it.
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
 * Featured sellers' posts (incl. Tunisian Cars) get the sales line; on-behalf
 * listings keep their owner's own number (that is the whole point of them).
 * The Tunisian Cars branch below only applies if Tunisian Cars is ever removed
 * from FEATURED_CONTACTS. Posts from any other seller are returned untouched.
 */
export function withTcContact<T>(post: T): T {
  const p = post as T & PostLike
  if (!p) return post
  const featured = p.merchant?.id ? FEATURED_CONTACTS[p.merchant.id] : undefined
  if (featured) return withNumber(p, featured) as T
  if (p.merchant?.id !== TC_MERCHANT_ID) return post

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

/**
 * A featured seller's listings (FEATURED_CONTACTS) are answered on another
 * number: it replaces the scraped phones and is the WhatsApp number (so the
 * detail shows both buttons). On-behalf listings keep their owner's number.
 */
function withNumber(p: PostLike, contact: ContactNumber): PostLike {
  if (p.isOnBehalf) return p
  return {
    ...p,
    merchant: { ...p.merchant, phone: contact.e164 },
    phone: contact.e164,
    phones: [contact.e164],
    whatsapp: contact.intl
  }
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
  if (!m) return merchant
  if (m.id !== TC_MERCHANT_ID) {
    const featured = m.id ? FEATURED_CONTACTS[m.id] : undefined
    return featured
      ? ({ ...m, phone: featured.e164, phones: [featured.e164] } as T)
      : merchant
  }
  // Tunisian Cars seller record: the site number, not the listings line.
  return {
    ...m,
    phone: TC_PHONE.e164,
    phones: [TC_PHONE.e164],
    ...(typeof m.description === 'string'
      ? { description: scrubOldNumber(m.description) }
      : {})
  } as T
}
