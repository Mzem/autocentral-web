import type { Metadata } from 'next'
import BottomAd from '../_components/ads/BottomAd'
import Footer from '../_components/Footer'
import Header from '../_components/Header'
import MainShell from '../_components/MainShell'
import { TC_URL } from '../_lib/site'
import { breadcrumbJsonLd, faviconMetadata } from '../_lib/site-metadata'

/**
 * Layout of tunisiancars.com.tn (garage / showroom site): its metadata, icons,
 * header, footer and the listing-detail modal slot. Autocentral has its own
 * (`app/autocentral/layout.tsx`); the two only share the root layout.
 */
export const metadata: Metadata = {
  // Needed so the (relative) share image resolves to an absolute, public URL -
  // otherwise Next resolves it against localhost and the preview stays blank.
  metadataBase: new URL(TC_URL),
  title: 'Tunisian Cars | Atelier & Showroom automobile à Sousse',
  description:
    "Tunisian Cars : atelier automobile de A à Z (restauration, mécanique, nettoyage profond, protection céramique) et showroom de véhicules d'exception à Sousse, Tunisie.",
  applicationName: 'Tunisian Cars',
  keywords: [
    'tunisian cars',
    'atelier automobile',
    'detailing',
    'protection céramique',
    'restauration voiture',
    'showroom',
    'sousse',
    'tunisie'
  ],
  openGraph: {
    type: 'website',
    url: TC_URL,
    title: 'Tunisian Cars | Atelier & Showroom automobile à Sousse',
    description:
      "Atelier automobile de A à Z et showroom de véhicules d'exception à Sousse, Tunisie.",
    siteName: 'Tunisian Cars',
    images: [
      {
        url: '/tunisiancars/logo_share.png',
        width: 1200,
        height: 630,
        alt: 'Tunisian Cars'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tunisian Cars | Atelier & Showroom automobile à Sousse',
    description:
      "Atelier automobile de A à Z et showroom de véhicules d'exception à Sousse, Tunisie.",
    images: ['/tunisiancars/logo_share.png']
  },
  // PWA - "Ajouter à l'écran d'accueil"
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Tunisian Cars',
    statusBarStyle: 'black-translucent'
  },
  // Favicons - jeu généré dans /public/favicon (cf. favicon/code.txt)
  ...faviconMetadata('/favicon')
}

export default function TunisianCarsLayout({
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
            { name: 'Atelier automobile à Sousse', url: TC_URL },
            { name: 'Véhicules en vente', url: `${TC_URL}/vente` },
            { name: 'Boutique', url: `${TC_URL}/produits` }
          ])
        }}
      />
      <Header />
      <MainShell ad={<BottomAd />}>{children}</MainShell>
      {modal}
      <Footer />
    </>
  )
}
