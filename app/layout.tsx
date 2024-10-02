import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './_styles/globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Header from './_components/Header'
import Footer from './_components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "AutoCentral.tn voitures d'occasion",
  description: "AutoCentral.tn voitures d'occasion",
  applicationName: 'AutoCentral.tn',
  keywords: ['tunis', 'tunisie', 'voiture', 'occasion', 'tayara', 'automobile'],
  openGraph: {
    type: 'website',
    url: 'https://autocentral.tn',
    title: "AutoCentral.tn voitures d'occasion",
    siteName: "AutoCentral.tn voitures d'occasion",
    images: '/logo_bg.svg'
  },
  metadataBase: new URL('https://autocentral.tn'),
  icons: {
    icon: '/logo_nav.svg',
    shortcut: '/logo_nav.svg',
    apple: '/logo_nav.svg'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='fr'>
      <body className={`${inter.className} flex flex-col min-h-screen bg-red`}>
        <Header />
        <main className='flex-grow bg-black'>
          <div className='w-[95%] lg:w-3/5 mx-auto mb-14 mt-4 lg:mt-12'>
            {children}
          </div>
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
