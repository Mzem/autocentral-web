import type { Metadata } from 'next'
import AcHeader from '../_components/autocentral/AcHeader'
import { AC_URL } from '../_lib/site'
import { breadcrumbJsonLd, faviconMetadata } from '../_lib/site-metadata'

/**
 * Layout of autocentral.tn (the listings aggregator). `middleware.ts` rewrites
 * every request on that domain to this `/autocentral` tree, so these pages are
 * served at clean URLs ("/", "/annonces", "/encheres"…).
 *
 * Its own identity (title, favicons, manifest), its own header and - by
 * design - no footer. The `theme-autocentral` wrapper turns the shared `brand`
 * accent into the Autocentral reds (see `_styles/globals.css`); it is
 * `display: contents`, so the page still lays out directly in <body>.
 */
const TITLE =
  "Voitures d'occasion en Tunisie - toutes les annonces | Autocentral"
const DESCRIPTION =
  "Vous cherchez une voiture d'occasion ? Autocentral.tn regroupe les annonces de voitures d'occasion de toute la Tunisie dans un seul moteur de recherche, avec les enchères publiques de véhicules (Douane, JORT)."

export const metadata: Metadata = {
  metadataBase: new URL(AC_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: 'autocentral.tn',
  keywords: [
    'tunis',
    'tunisie',
    'voiture',
    'occasion',
    'annonces',
    'tayara',
    'automobile',
    'enchères',
    'autocentral'
  ],
  openGraph: {
    type: 'website',
    url: AC_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'Autocentral',
    images: [
      {
        url: '/autocentral/logo_rect.jpg',
        width: 1125,
        height: 876,
        alt: 'Autocentral'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/autocentral/logo_rect.jpg']
  },
  manifest: '/autocentral/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Autocentral',
    statusBarStyle: 'black-translucent'
  },
  // Original Autocentral icon set, restored in /public/autocentral/favicon.
  ...faviconMetadata('/autocentral/favicon')
}

export default function AutocentralLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "Voitures d'occasion en Tunisie", url: AC_URL },
            { name: 'Moteur de recherche', url: `${AC_URL}/annonces` },
            { name: 'Estimer mon véhicule', url: `${AC_URL}/estimation` },
            { name: 'Enchères véhicules', url: `${AC_URL}/encheres` }
          ])
        }}
      />
      <div className='theme-autocentral contents'>
        <AcHeader />
        <main className='flex-grow'>{children}</main>
        {modal}
      </div>
    </>
  )
}
