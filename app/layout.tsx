import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './_styles/globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

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
      <body className={inter.className}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
