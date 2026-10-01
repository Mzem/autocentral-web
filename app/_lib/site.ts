/**
 * Two sites, one Next app (one Scalingo app):
 *
 *  - tunisiancars.com.tn → the garage / showroom site. Its pages live in the
 *    `app/(tc)/` route group and are served at their natural URLs.
 *  - autocentral.tn      → the listings aggregator. Its pages live under
 *    `app/autocentral/`; `middleware.ts` rewrites every request on that host to
 *    this internal prefix, so the browser URL stays clean (`/annonces`…).
 *
 * Because the split is a rewrite (not a `headers()` lookup in a layout), pages
 * stay statically rendered / ISR on both sites.
 */
export const TC_URL = 'https://tunisiancars.com.tn'
export const AC_URL = 'https://autocentral.tn'

/** Internal route prefix of the Autocentral tree (never visible in the URL). */
export const AC_PREFIX = '/autocentral'

/** Merchant id of the Tunisian Cars showroom in the API. */
export const TC_MERCHANT_ID = 'tunisian-cars'

/** The one public Tunisian Cars number (calls + WhatsApp). */
export const TC_PHONE = {
  display: '98 192 053',
  intl: '21698192053',
  e164: '+21698192053'
}
export const TC_WHATSAPP_URL = `https://wa.me/${TC_PHONE.intl}`
/** Messenger of the Facebook page tunisiancars.tn */
export const TC_MESSENGER_URL = 'https://m.me/tunisiancars.tn'

/**
 * Browser-visible path for a pathname that may carry the internal Autocentral
 * prefix. `usePathname()` returns the internal path when a page is prerendered
 * (build / ISR) but the clean one in the browser, so anything rendered from the
 * pathname must go through this to hydrate without a mismatch.
 */
export function visiblePath(pathname: string | null | undefined): string {
  const p = pathname ?? '/'
  if (p === AC_PREFIX) return '/'
  return p.startsWith(AC_PREFIX + '/') ? p.slice(AC_PREFIX.length) : p
}
