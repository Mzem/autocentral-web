import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Manrope, Sora } from 'next/font/google'
import BottomAd from './_components/ads/BottomAd'
import Footer from './_components/Footer'
import Header from './_components/Header'
import MainShell from './_components/MainShell'
import './_styles/globals.css'

// Body / UI — clean geometric sans (premium, highly legible).
const sans = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap'
})

// Display headings — modern geometric sans (premium, automotive-tech feel).
const display = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap'
})

export const metadata: Metadata = {
  // Needed so the (relative) share image resolves to an absolute, public URL —
  // otherwise Next resolves it against localhost and the preview stays blank.
  metadataBase: new URL('https://tunisiancars.com.tn'),
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
    url: 'https://tunisiancars.com.tn',
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
  }
}

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <html lang='fr' className={`${sans.variable} ${display.variable}`}>
      <head>
        <meta name='application-name' content='Tunisian Cars' />
        <meta name='theme-color' content='#000000' />

        {/* Favicons — jeu généré dans /public/favicon (cf. favicon/code.txt) */}
        <link rel='icon' href='/favicon/favicon.ico' sizes='any' />
        <link
          rel='apple-touch-icon-precomposed'
          sizes='57x57'
          href='/favicon/apple-touch-icon-57x57.png'
        />
        <link
          rel='apple-touch-icon-precomposed'
          sizes='114x114'
          href='/favicon/apple-touch-icon-114x114.png'
        />
        <link
          rel='apple-touch-icon-precomposed'
          sizes='72x72'
          href='/favicon/apple-touch-icon-72x72.png'
        />
        <link
          rel='apple-touch-icon-precomposed'
          sizes='144x144'
          href='/favicon/apple-touch-icon-144x144.png'
        />
        <link
          rel='apple-touch-icon-precomposed'
          sizes='60x60'
          href='/favicon/apple-touch-icon-60x60.png'
        />
        <link
          rel='apple-touch-icon-precomposed'
          sizes='120x120'
          href='/favicon/apple-touch-icon-120x120.png'
        />
        <link
          rel='apple-touch-icon-precomposed'
          sizes='76x76'
          href='/favicon/apple-touch-icon-76x76.png'
        />
        <link
          rel='apple-touch-icon-precomposed'
          sizes='152x152'
          href='/favicon/apple-touch-icon-152x152.png'
        />
        <link
          rel='icon'
          type='image/png'
          href='/favicon/favicon-196x196.png'
          sizes='196x196'
        />
        <link
          rel='icon'
          type='image/png'
          href='/favicon/favicon-96x96.png'
          sizes='96x96'
        />
        <link
          rel='icon'
          type='image/png'
          href='/favicon/favicon-32x32.png'
          sizes='32x32'
        />
        <link
          rel='icon'
          type='image/png'
          href='/favicon/favicon-16x16.png'
          sizes='16x16'
        />
        <link
          rel='icon'
          type='image/png'
          href='/favicon/favicon-128.png'
          sizes='128x128'
        />
        <meta name='msapplication-TileColor' content='#FFFFFF' />
        <meta
          name='msapplication-TileImage'
          content='/favicon/mstile-144x144.png'
        />
        <meta
          name='msapplication-square70x70logo'
          content='/favicon/mstile-70x70.png'
        />
        <meta
          name='msapplication-square150x150logo'
          content='/favicon/mstile-150x150.png'
        />
        <meta
          name='msapplication-wide310x150logo'
          content='/favicon/mstile-310x150.png'
        />
        <meta
          name='msapplication-square310x310logo'
          content='/favicon/mstile-310x310.png'
        />

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
                  item: 'https://tunisiancars.com.tn'
                },
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Vendeurs voitures occasion Tunisie',
                  item: 'https://tunisiancars.com.tn/vendeurs'
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: 'Fiche technique Tunisie',
                  item: 'https://tunisiancars.com.tn/fiche-technique'
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
        {modal}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
