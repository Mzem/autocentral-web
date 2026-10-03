import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AC_NAV_LINKS } from '../../_lib/nav'
import InstallAppButton from '../tunisiancars/InstallAppButton'

/**
 * Footer of autocentral.tn: black, with the logo, the "install the app" (PWA)
 * button in the site red, and the site's entries.
 */
export default function AcFooter() {
  return (
    <footer className='border-t border-white/10 bg-black text-white'>
      <div className='mx-auto flex w-[92%] flex-col items-center gap-6 py-10 text-center xl:max-w-6xl md:flex-row md:justify-between md:text-left'>
        <div className='flex flex-col items-center gap-2 md:items-start'>
          <Link href='/' aria-label='Accueil Autocentral'>
            <img
              src='/autocentral/logo_wordmark.svg'
              alt='Autocentral'
              className='h-7 w-auto'
            />
          </Link>
          <p className='max-w-xs text-xs leading-relaxed text-white/55'>
            Toutes les annonces de voitures d&apos;occasion en Tunisie, au même
            endroit.
          </p>
        </div>

        <InstallAppButton solid />
      </div>

      <div className='border-t border-white/10'>
        <div className='mx-auto flex w-[92%] flex-col items-center gap-3 py-5 text-xs text-white/50 xl:max-w-6xl md:flex-row md:justify-between'>
          <nav
            aria-label='Navigation secondaire'
            className='flex flex-wrap justify-center gap-x-5 gap-y-2'
          >
            {AC_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='inline-flex items-center gap-1.5 transition-colors hover:text-white'
              >
                <FontAwesomeIcon icon={link.icon} className='h-3 w-3' />
                {link.label}
              </Link>
            ))}
          </nav>
          <p>© {new Date().getFullYear()} Autocentral · Tous droits réservés</p>
        </div>
      </div>
    </footer>
  )
}
