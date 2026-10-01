import type { Metadata } from 'next'

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
