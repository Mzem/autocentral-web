import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Footer from './_components/Footer'
import Header from './_components/Header'
import './_styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Voitures d'occasion en Tunisie",
  description: "Voitures d'occasion en Tunisie",
  applicationName: 'autocentral.tn',
  keywords: [
    'tunis',
    'tunisie',
    'voiture',
    'occasion',
    'tayara',
    'automobile',
    'autocentral'
  ],
  openGraph: {
    type: 'website',
    url: 'https://autocentral.tn',
    title: "Voitures d'occasion en Tunisie",
    siteName: "Voitures d'occasion en Tunisie",
    images: '/logo_square.svg'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='fr'>
      <head>
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
        <meta name='application-name' content='autocentral.tn' />
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
                  item: 'https://autocentral.tn'
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Fiche technique',
                  item: 'https://autocentral.tn/fiche-technique'
                }
              ]
            })
          }}
        />
      </head>
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-blackopac`}
      >
        <Header />
        <main className='flex-grow bg-whiteBG'>
          <div className='w-[98%] lg:w-3/5 mx-auto mb-14 mt-4 lg:mt-12'>
            {children}
          </div>
        </main>
        <Footer />
        {/* <Analytics />
        <SpeedInsights /> */}
      </body>
    </html>
  )
}
