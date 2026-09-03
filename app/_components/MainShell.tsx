'use client'

import { usePathname } from 'next/navigation'

/**
 * Wraps page content.
 *
 * The Tunisian Cars home is an edge-to-edge branded landing (full-bleed
 * carousels, white sections), so it renders with no width constraint and no
 * top offset - its hero sits under the fixed, transparent header on purpose.
 *
 * Every other (kept) page keeps the original centered container and gains a top
 * padding to clear the now-fixed header.
 */
export default function MainShell({
  children,
  ad
}: {
  children: React.ReactNode
  ad: React.ReactNode
}) {
  const pathname = usePathname()

  // Branded, edge-to-edge pages: hero sits under the fixed transparent header.
  // The listing detail is also full-bleed (a white page filling the layout).
  const isFullBleed =
    pathname === '/' ||
    pathname === '/atelier' ||
    pathname.startsWith('/annonces') ||
    pathname.startsWith('/produits') ||
    pathname.startsWith('/encheres')

  if (isFullBleed) {
    return <main className='flex-grow'>{children}</main>
  }

  return (
    <main className='flex-grow pt-14 lg:pt-16'>
      <div className='w-[94%] sm:w-[92%] lg:w-[88%] xl:max-w-6xl mx-auto mb-10 mt-4 lg:mt-10'>
        {children}
      </div>
      <div className='rounded w-[94%] sm:w-[92%] lg:w-[88%] xl:max-w-6xl mb-4 mx-auto'>
        {ad}
      </div>
    </main>
  )
}
