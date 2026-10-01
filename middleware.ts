import { NextRequest, NextResponse } from 'next/server'

/**
 * Two sites, one app (see app/_lib/site.ts):
 *
 *  - tunisiancars.com.tn → pages of the `app/(tc)/` route group, natural URLs.
 *  - autocentral.tn      → pages under `app/autocentral/`. Every request on that
 *    domain is REWRITTEN here to the internal `/autocentral` prefix; the URL in
 *    the browser stays clean ("/", "/annonces", "/encheres"…).
 *
 * A rewrite (rather than reading the host in a layout) keeps the pages static /
 * ISR on both sites.
 */
const AC_PREFIX = '/autocentral'
const AC_ORIGIN = 'https://autocentral.tn'

// Preview switch for hosts that are neither production domain (localhost, the
// *.scalingo.io address): `?__site=autocentral` shows the Autocentral site
// there, `?__site=tunisiancars` goes back. Ignored on the real domains.
const PREVIEW_PARAM = '__site'
const PREVIEW_COOKIE = '__site'

function requestHost(req: NextRequest): string {
  const raw =
    req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? ''
  return raw.split(',')[0].trim().toLowerCase().replace(/:\d+$/, '')
}

const isAcDomain = (host: string) =>
  host === 'autocentral.tn' || host.endsWith('.autocentral.tn')
const isTcDomain = (host: string) =>
  host === 'tunisiancars.com.tn' || host.endsWith('.tunisiancars.com.tn')

export function middleware(req: NextRequest) {
  const host = requestHost(req)
  const { pathname, search } = req.nextUrl
  const production = isAcDomain(host) || isTcDomain(host)

  // ── Preview switch (non-production hosts only) ──
  if (!production) {
    const pick = req.nextUrl.searchParams.get(PREVIEW_PARAM)
    if (pick) {
      const url = req.nextUrl.clone()
      url.searchParams.delete(PREVIEW_PARAM)
      const res = NextResponse.redirect(url)
      if (pick === 'autocentral') {
        res.cookies.set(PREVIEW_COOKIE, 'autocentral', { path: '/' })
      } else {
        res.cookies.delete(PREVIEW_COOKIE)
      }
      return res
    }
  }

  const isAutocentral =
    isAcDomain(host) ||
    (!production &&
      (host === 'autocentral.localhost' ||
        req.cookies.get(PREVIEW_COOKIE)?.value === 'autocentral'))

  const prefixed =
    pathname === AC_PREFIX || pathname.startsWith(AC_PREFIX + '/')

  // ───────────── autocentral.tn ─────────────
  if (isAutocentral) {
    // The internal prefix must never show up in a URL.
    if (prefixed) {
      const url = req.nextUrl.clone()
      url.pathname = pathname.slice(AC_PREFIX.length) || '/'
      return NextResponse.redirect(url, 308)
    }
    const url = req.nextUrl.clone()
    url.pathname =
      pathname === '/favicon.ico'
        ? `${AC_PREFIX}/favicon/favicon.ico`
        : // pages, plus robots.txt / sitemap.xml (public/autocentral/…)
          AC_PREFIX + (pathname === '/' ? '' : pathname)
    return NextResponse.rewrite(url)
  }

  // ───────────── tunisiancars.com.tn ─────────────
  if (prefixed) {
    // The Autocentral tree belongs to its own domain. (Left reachable on
    // non-production hosts, handy to look at it without the preview switch.)
    if (isTcDomain(host)) {
      const rest = pathname.slice(AC_PREFIX.length) || '/'
      return NextResponse.redirect(AC_ORIGIN + rest + search, 308)
    }
    return NextResponse.next()
  }

  if (pathname === '/favicon.ico') {
    const url = req.nextUrl.clone()
    url.pathname = '/favicon/favicon.ico'
    return NextResponse.rewrite(url)
  }

  // The workshop page is now the home.
  if (pathname === '/atelier') {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url, 308)
  }

  // The search engine and the auctions moved to autocentral.tn. Their old URLs
  // on tunisiancars.com.tn keep working until this is switched on - which must
  // only be done once autocentral.tn really serves this app (while it still
  // redirects to tunisiancars.com.tn/annonces, this would loop).
  if (
    process.env.AUTOCENTRAL_REDIRECTS === '1' &&
    isTcDomain(host) &&
    (pathname === '/annonces' || pathname === '/encheres')
  ) {
    return NextResponse.redirect(AC_ORIGIN + pathname + search, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Per-site files served under the same public URL.
    '/robots.txt',
    '/sitemap.xml',
    '/favicon.ico',
    // Every page: skip API routes, Next internals and files (anything whose
    // last segment has an extension, i.e. the content of /public).
    '/((?!api/|_next/|.*\\.[^/]+$).*)'
  ]
}
