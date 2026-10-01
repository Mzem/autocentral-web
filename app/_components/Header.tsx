'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import {
  faFacebookMessenger,
  faWhatsapp
} from '@fortawesome/free-brands-svg-icons'
import '../_lib/fontawesome'
import {
  NAV_LINKS,
  ADMIN_NAV_LINKS,
  CONTACT_URL,
  WHATSAPP_URL
} from '../_lib/nav'
import { useMerchantKey } from '../_lib/useMerchantKey'

/**
 * Header of tunisiancars.com.tn: Atelier / Vente / Boutique, then Localisation
 * and the two contact channels (Messenger + WhatsApp). Autocentral has its own
 * header (`autocentral/AcHeader.tsx`).
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const menuButtonRef = useRef<HTMLButtonElement | null>(null)
  const pathname = usePathname()
  const { key } = useMerchantKey()

  // Merchants also get quick links to the internal pages (none for now).
  const navLinks = key ? [...NAV_LINKS, ...ADMIN_NAV_LINKS] : NAV_LINKS

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
      setIsScrolled(window.scrollY > 8)
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

  // "/" (Atelier) is the home: it must match exactly, or it would be active on
  // every page.
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  // Mobile pills: icon-only for the two contact channels (there is no room for
  // three labelled pills next to the logo), labels come back on wide phones.
  const mobilePill =
    'flex items-center gap-1 whitespace-nowrap rounded-lg sm:px-2.5 sm:py-1.5 p-1.5 text-[0.7rem] font-semibold text-white transition-colors'

  return (
    <div
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        isScrolled || isMenuOpen
          ? 'bg-black/80 backdrop-blur-xl'
          : 'bg-black/45 backdrop-blur-md'
      }`}
    >
      <header className='flex flex-row w-[94%] lg:w-[90%] xl:max-w-6xl items-center justify-between mx-auto h-14 lg:h-16'>
        <Link href='/' aria-label='Accueil Tunisian Cars' className='shrink-0'>
          <img
            src='/tunisiancars/logo_rect.png'
            alt='Tunisian Cars'
            className='h-10 lg:h-12 w-auto brightness-0 invert transition-opacity hover:opacity-80'
          />
        </Link>

        <nav className='hidden md:flex items-center gap-1'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium tracking-wide transition-colors ${
                isActive(link.href)
                  ? 'bg-white/10 text-white'
                  : 'text-white/75 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FontAwesomeIcon icon={link.icon} className='h-4 w-4' />
              <span>{link.label}</span>
            </Link>
          ))}
          <a
            href='#contact'
            className='ml-1 flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/15'
          >
            <FontAwesomeIcon icon={faLocationDot} className='h-4 w-4' />
            <span>Localisation</span>
          </a>
          <a
            href={CONTACT_URL}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Contact Messenger'
            className='ml-1.5 flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600'
          >
            <FontAwesomeIcon icon={faFacebookMessenger} className='h-4 w-4' />
            <span>Contact</span>
          </a>
          <a
            href={WHATSAPP_URL}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Contact WhatsApp'
            className='ml-1.5 flex items-center gap-1.5 rounded-lg bg-whatsapp px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90'
          >
            <FontAwesomeIcon icon={faWhatsapp} className='h-4 w-4' />
            <span>WhatsApp</span>
          </a>
        </nav>

        <div className='flex items-center sm:gap-1.5 gap-1 md:hidden'>
          <a
            href='#contact'
            aria-label='Nous trouver'
            className={`${mobilePill} bg-white/10 hover:bg-white/15`}
          >
            <FontAwesomeIcon icon={faLocationDot} className='h-3.5 w-3.5' />
            {/* Icon-only under 380px so the cluster (logo + 3 pills + menu)
                never overflows; the label returns above that. Raw media
                queries: this project's `screens` config disables Tailwind's
                min-[…]/max-[…] variants. */}
            <span className='[@media(max-width:379px)]:hidden'>
              Localisation
            </span>
          </a>
          <a
            href={CONTACT_URL}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Contact Messenger'
            className={`${mobilePill} bg-brand-500 hover:bg-brand-600`}
          >
            <FontAwesomeIcon
              icon={faFacebookMessenger}
              className='h-3.5 w-3.5'
            />
            <span className='hidden [@media(min-width:560px)]:inline'>
              Contact
            </span>
          </a>
          <a
            href={WHATSAPP_URL}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Contact WhatsApp'
            className={`${mobilePill} bg-whatsapp hover:opacity-90`}
          >
            <FontAwesomeIcon icon={faWhatsapp} className='h-3.5 w-3.5' />
            <span className='hidden [@media(min-width:560px)]:inline'>
              WhatsApp
            </span>
          </a>

          <button
            onClick={switchMenu}
            ref={menuButtonRef}
            aria-expanded={isMenuOpen}
            aria-controls='mobile-menu'
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className='flex h-9 w-9 items-center justify-center rounded-lg text-white/85 transition-colors hover:bg-white/10 hover:text-white'
          >
            <span className='sr-only'>Menu</span>
            <svg viewBox='0 0 24 24' className='h-6 w-6' aria-hidden='true'>
              <path
                fill='currentColor'
                d={
                  isMenuOpen
                    ? 'M6.4 4.98 12 10.6l5.6-5.62 1.42 1.42L13.4 12l5.62 5.6-1.42 1.42L12 13.4l-5.6 5.62-1.42-1.42L10.6 12 4.98 6.4z'
                    : 'M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z'
                }
              />
            </svg>
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div
          id='mobile-menu'
          ref={menuRef}
          className='md:hidden absolute inset-x-0 top-14 border-b border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl animate-fade-in-up'
        >
          <nav className='flex flex-col p-2'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm transition-colors ${
                  isActive(link.href)
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-white/80 hover:bg-white/5'
                }`}
              >
                <FontAwesomeIcon
                  icon={link.icon}
                  className='h-4 w-4 text-brand-400'
                />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
