import type { Metadata } from 'next'
import { AC_URL } from './site'

/**
 * Favicon / touch-icon / tile metadata for one site. Both sites use an icon set
 * produced by the same generator (identical file names), each in its own
 * folder: `/favicon` for Tunisian Cars, `/autocentral/favicon` for Autocentral.
 */
export function faviconMetadata(
  dir: string
): Pick<Metadata, 'icons' | 'other'> {
  const square = (s: number) => `${s}x${s}`
  return {
    icons: {
      icon: [
        { url: `${dir}/favicon.ico`, sizes: 'any' },
        ...[196, 96, 32, 16].map((s) => ({
          url: `${dir}/favicon-${square(s)}.png`,
          type: 'image/png',
          sizes: square(s)
        })),
        { url: `${dir}/favicon-128.png`, type: 'image/png', sizes: '128x128' }
      ],
      other: [57, 114, 72, 144, 60, 120, 76, 152].map((s) => ({
        rel: 'apple-touch-icon-precomposed',
        url: `${dir}/apple-touch-icon-${square(s)}.png`,
        sizes: square(s)
      }))
    },
    other: {
      'mobile-web-app-capable': 'yes',
      'msapplication-TileColor': '#FFFFFF',
      'msapplication-TileImage': `${dir}/mstile-144x144.png`,
      'msapplication-square70x70logo': `${dir}/mstile-70x70.png`,
      'msapplication-square150x150logo': `${dir}/mstile-150x150.png`,
      'msapplication-wide310x150logo': `${dir}/mstile-310x150.png`,
      'msapplication-square310x310logo': `${dir}/mstile-310x310.png`
    }
  }
}

/** `<script type="application/ld+json">` payload for a simple breadcrumb. */
export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url
    }))
  })
}

const AC_SHARE_IMAGE = '/autocentral/logo_rect.jpg'

/**
 * Metadata of an autocentral.tn page: title, description, canonical URL and
 * the matching Open Graph / Twitter tags (without them every page would share
 * the home's title, description and URL when posted on social networks).
 */
export function acPageMetadata({
  title,
  description,
  path = '',
  image
}: {
  title: string
  description: string
  /** Path on autocentral.tn ('' for the home). */
  path?: string
  /** Share image (defaults to the Autocentral logo). */
  image?: string
}): Metadata {
  const url = `${AC_URL}${path}`
  const images = [image ?? AC_SHARE_IMAGE]
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'Autocentral',
      locale: 'fr_TN',
      images
    },
    twitter: { card: 'summary_large_image', title, description, images }
  }
}

/** schema.org WebSite of autocentral.tn, with its search box (sitelinks). */
export function acWebsiteJsonLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Autocentral',
    alternateName: 'autocentral.tn',
    url: AC_URL,
    inLanguage: 'fr-TN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${AC_URL}/annonces?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  })
}
