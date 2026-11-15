'use client'

import { AC_URL, TC_URL } from './site'
import { setMerchantKey } from './useMerchantKey'

/**
 * One login for both sites. The merchant key lives in localStorage, which is
 * per domain, so after a login on one site the browser makes a quick round
 * trip through the other site's /login page to store the same key there:
 *
 *   autocentral.tn/login  →  tunisiancars.com.tn/login#sync=<key>&back=<url>
 *                         →  back to <url> on autocentral.tn
 *
 * The key travels in the URL fragment (never sent to any server) and is wiped
 * from the address bar / history before leaving. Only the two production
 * domains take part; on localhost / *.scalingo.io the login stays local.
 */
const ORIGINS = [AC_URL, TC_URL]

function otherOrigin(): string | null {
  const here = window.location.origin
  if (here === AC_URL) return TC_URL
  if (here === TC_URL) return AC_URL
  return null
}

/** Stores the key here, then mirrors it on the other site and comes back. */
export function loginEverywhere(key: string, nextPath: string): boolean {
  setMerchantKey(key)
  const other = otherOrigin()
  if (!other) return false
  const back = window.location.origin + nextPath
  window.location.assign(
    `${other}/login#sync=${encodeURIComponent(key)}&back=${encodeURIComponent(
      back
    )}`
  )
  return true
}

/**
 * Called on /login: completes a hand-off started on the other site. Returns
 * true when it is redirecting (the page should not render its form).
 */
export function completeHandoff(): boolean {
  const hash = window.location.hash.replace(/^#/, '')
  if (!hash) return false
  const params = new URLSearchParams(hash)
  if (!params.has('sync')) return false

  const key = params.get('sync') ?? ''
  const back = params.get('back') ?? ''
  // Never leave the key in the address bar / history.
  window.history.replaceState(null, '', window.location.pathname)

  const backOk = ORIGINS.some((o) => back === o || back.startsWith(o + '/'))
  if (!key || !backOk) return false

  setMerchantKey(key)
  window.location.replace(back)
  return true
}
