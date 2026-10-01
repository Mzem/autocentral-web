'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../_lib/fontawesome'
import { AC_NAV_LINKS } from '../../_lib/nav'
import { visiblePath } from '../../_lib/site'

/**
 * Header of autocentral.tn: the logo and two entries (search engine, auctions).
 * No location / contact buttons - those belong to the Tunisian Cars site.
 */
export default function AcHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  // Prerendered pages see the internal "/autocentral/…" path, the browser the
  // clean one: normalise so the active state hydrates identically.
  const path = visiblePath(usePathname())

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    path === href || path.startsWith(href + '/')

  return (
    <div
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-xl'
          : 'bg-black/45 backdrop-blur-md'
      }`}
    >
      <header className='mx-auto flex h-14 w-[94%] items-center justify-between gap-2 lg:h-16 lg:w-[90%] xl:max-w-6xl'>
        <Link href='/' aria-label='Accueil Autocentral' className='shrink-0'>
          <img
            src='/autocentral/logo_wordmark.svg'
            alt='Autocentral'
            className='h-[22px] w-auto transition-opacity hover:opacity-80 sm:h-6 lg:h-7'
          />
        </Link>

        <nav
          aria-label='Navigation principale'
          className='flex items-center gap-1 sm:gap-1.5'
        >
          {AC_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-label={link.label}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-semibold tracking-wide transition-colors md:px-3 md:text-sm ${
                isActive(link.href)
                  ? 'bg-white/10 text-white'
                  : 'text-white/75 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FontAwesomeIcon icon={link.icon} className='h-3.5 w-3.5' />
              {/* Short label on phones, icon-only under 350px (logo + two
                  labelled pills don't fit), full label from tablets up. */}
              <span className='[@media(max-width:349px)]:hidden md:hidden'>
                {link.short ?? link.label}
              </span>
              <span className='hidden md:inline'>{link.label}</span>
            </Link>
          ))}
        </nav>
      </header>
    </div>
  )
}
