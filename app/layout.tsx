import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Manrope, Sora } from 'next/font/google'
import './_styles/globals.css'

// Body / UI - clean geometric sans (premium, highly legible).
const sans = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap'
})

// Display headings - modern geometric sans (premium, automotive-tech feel).
const display = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap'
})

/**
 * Root layout shared by BOTH sites served by this app (see `_lib/site.ts`):
 * only what is truly common lives here - fonts, global CSS, analytics/ads tags.
 *
 * Everything site-specific (title, favicons, manifest, header, footer…) is in
 * the site layouts: `(tc)/layout.tsx` for tunisiancars.com.tn and
 * `autocentral/layout.tsx` for autocentral.tn.
 */
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='fr' className={`${sans.variable} ${display.variable}`}>
      <head>
        {/* Google Tag Manager - as high as possible in <head> */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WCL5QGNS');`
          }}
        />
        {/* End Google Tag Manager */}

        <meta name='theme-color' content='#000000' />

        {/* Refuse forced/auto dark modes (Android Chrome "Auto Dark Theme",
            Dark Reader…) that re-invert our own design and make it ugly. */}
        <meta name='color-scheme' content='only light' />
        <meta name='supported-color-schemes' content='light' />
        <meta name='darkreader-lock' />

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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-WCL5QGNS'
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
