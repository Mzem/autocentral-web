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

  // One hostname per site: "www." is a duplicate for search engines, so it is
  // redirected (permanently) to the bare domain, same path and query.
  if (production && host.startsWith('www.')) {
    const url = req.nextUrl.clone()
    url.host = host.slice(4)
    url.protocol = 'https'
    url.port = ''
    return NextResponse.redirect(url, 308)
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

  // The price estimate only exists on autocentral.tn (the "Estimer" buttons of
  // the listings link to a relative /estimation?…, shared by both sites).
  if (pathname === '/estimation') {
    if (isTcDomain(host)) {
      return NextResponse.redirect(AC_ORIGIN + pathname + search, 308)
    }
    const url = req.nextUrl.clone()
    url.pathname = AC_PREFIX + pathname
    return NextResponse.rewrite(url)
  }

  // The workshop page is now the home.
  if (pathname === '/atelier') {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url, 308)
  }

  // tunisiancars.com.tn only keeps its own pages (home, shop, cars for sale,
  // admin). Everything about listings and sellers lives on autocentral.tn:
  // search engine, listing pages, sellers, seller pages, auctions, car specs.
  // Their old URLs (indexed by Google) are redirected permanently, same path.
  if (isTcDomain(host) && !isTcPage(pathname)) {
    return NextResponse.redirect(AC_ORIGIN + pathname + search, 308)
  }

  return NextResponse.next()
}

/** The pages tunisiancars.com.tn keeps (anything else goes to autocentral.tn). */
function isTcPage(pathname: string): boolean {
  const under = (p: string) => pathname === p || pathname.startsWith(p + '/')
  return (
    pathname === '/' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    under('/vente') ||
    under('/produits') ||
    under('/login') ||
    // Admin forms of the showroom (cars / motos).
    pathname === '/annonces/nouveau' ||
    pathname === '/annonces/moto-nouveau' ||
    // Motos are only sold by Tunisian Cars: their pages stay here.
    under('/annonces/moto') ||
    // A car listing: opened from /vente it stays here (modal); a direct visit
    // is redirected to autocentral.tn by the page itself - the middleware
    // can't tell the two apart (Next strips the RSC headers before it).
    /^\/annonces\/[^/]+$/.test(pathname)
  )
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
