import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './_styles/globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Header from './_components/Header'
import Footer from './_components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TuniAutos Marketplace',
  description: 'TuniAutos Marketplace',
  applicationName: 'TuniAutos',
  icons: {
    icon: '/logo_nav_2.svg',
    shortcut: '/logo_nav_2.svg',
    apple: '/logo_nav_2.svg'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='fr'>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header />
        <main className='flex-grow w-[95%] lg:w-3/5 mx-auto'>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
