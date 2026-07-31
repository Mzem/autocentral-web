import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import BottomAd from './_components/ads/BottomAd'
import Footer from './_components/Footer'
import Header from './_components/Header'
import MainShell from './_components/MainShell'
import './_styles/globals.css'

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // Specify the font weights you need
  variable: '--font-open-sans' // Define a CSS variable for Tailwind integration
})

export const metadata: Metadata = {
  title: 'Tunisian Cars — Atelier & Showroom automobile à Sousse',
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
  icons: {
    icon: '/tunisiancars/tc_bleu_logo.jpeg',
    apple: '/tunisiancars/tc_bleu_logo.jpeg'
  },
  openGraph: {
    type: 'website',
    url: 'https://autocentral.tn',
    title: 'Tunisian Cars — Atelier & Showroom automobile à Sousse',
    siteName: 'Tunisian Cars',
    images: '/tunisiancars/tc_garage_logo.jpeg'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='fr' className={openSans.variable}>
      <head>
        <meta name='application-name' content='Tunisian Cars' />
        <meta name='theme-color' content='#000000' />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: "Voitures d'occasion en Tunisie",
                  item: 'https://autocentral.tn'
                },
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Vendeurs voitures occasion Tunisie',
                  item: 'https://autocentral.tn/vendeurs'
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: 'Fiche technique Tunisie',
                  item: 'https://autocentral.tn/fiche-technique'
                }
              ]
            })
          }}
        />
        {/* Google Analytics Script */}
        <script
          async
          src='https://www.googletagmanager.com/gtag/js?id=G-NP3EXHPXDR'
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NP3EXHPXDR');
            `
          }}
        />
        <meta name='google-adsense-account' content='ca-pub-6991672787454088' />
        <script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6991672787454088'
          crossOrigin='anonymous'
        ></script>
      </head>

      <body className='flex flex-col min-h-screen bg-black text-white'>
        <Header />
        <MainShell ad={<BottomAd />}>{children}</MainShell>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
