'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const NAV_LINKS = [
  { href: '/', label: "Voitures d'occasion", icon: '/car_white.svg' },
  { href: '/fiche-technique', label: 'Fiches techniques', icon: '/gears.svg' },
  { href: '/vendeurs', label: 'Vendeurs professionnels', icon: '/man.svg' },
  { href: '/produits', label: 'Boutique', icon: '/cart.svg' }
]

const CONTACT_URL =
  'https://m.me/autocentral.tn?text=Je%20veux%20d%C3%A9poser%20une%20annonce%20sur%20autocentral'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const menuButtonRef = useRef<HTMLButtonElement | null>(null)
  const pathname = usePathname()

  const switchMenu = () => setIsMenuOpen((prev) => !prev)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        setIsMenuOpen(false)
      }
    }
    const handleScroll = () => {
      setIsMenuOpen(false)
      setIsScrolled(window.scrollY > 4)
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <div className='bg-ink-50'>
      <div
        className={`w-full fixed z-30 border-b transition-all duration-300 ${
          isScrolled || isMenuOpen
            ? 'bg-ink-950/95 backdrop-blur-md border-white/10 shadow-lg'
            : 'bg-ink-950 border-transparent'
        }`}
      >
        <header className='flex flex-row w-[94%] lg:w-[88%] xl:max-w-6xl items-center justify-between mx-auto h-12 lg:h-14'>
          <Link
            href='/'
            aria-label='Accueil autocentral.tn'
            className='shrink-0'
          >
            <img
              src='/logo.svg'
              alt='autocentral.tn'
              className='h-16 lg:h-20 transition-opacity hover:opacity-80'
            />
          </Link>

          <nav className='hidden xl:flex items-center gap-1'>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  isActive(link.href)
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <img
                  src={link.icon}
                  alt=''
                  aria-hidden='true'
                  className='h-4'
                />
                <span>{link.label}</span>
              </Link>
            ))}
            <a
              href={CONTACT_URL}
              className='ml-2 flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500'
            >
              <span>Déposer une annonce</span>
              <img
                src='/whatsapp_white.svg'
                className='h-4'
                alt=''
                aria-hidden='true'
              />
            </a>
          </nav>

          <div className='flex items-center gap-2 xl:hidden'>
            <a
              href={CONTACT_URL}
              className='flex items-center gap-1 rounded-lg bg-brand-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-500'
            >
              <span>Contact</span>
              <img
                src='/whatsapp_white.svg'
                className='h-3.5 w-3.5'
                alt=''
                aria-hidden='true'
              />
            </a>

            <button
              onClick={switchMenu}
              ref={menuButtonRef}
              aria-expanded={isMenuOpen}
              aria-controls='mobile-menu'
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              className='flex flex-col items-center rounded-lg p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white'
            >
              <img
                src='/menu.svg'
                className='h-6 w-6'
                alt=''
                aria-hidden='true'
              />
              <span className='text-[0.6rem] leading-none'>Menu</span>
            </button>
          </div>
        </header>
      </div>

      {isMenuOpen && (
        <div
          id='mobile-menu'
          ref={menuRef}
          className='xl:hidden fixed top-12 inset-x-0 z-30 mx-auto w-full overflow-hidden border-b border-white/10 bg-ink-950/98 backdrop-blur-md shadow-xl animate-fade-in-up'
        >
          <nav className='flex flex-col'>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`flex items-center justify-between gap-3 border-b border-white/5 px-5 py-3.5 text-sm transition-colors ${
                  isActive(link.href)
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-white/80 hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                <img
                  src={link.icon}
                  className='h-5'
                  alt=''
                  aria-hidden='true'
                />
              </Link>
            ))}
          </nav>
        </div>
      )}

      <div className='mt-12 lg:mt-14' />
    </div>
  )
}
