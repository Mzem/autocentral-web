import Link from 'next/link'

const FOOTER_LINKS = [
  { href: '/', label: "Voitures d'occasion" },
  { href: '/fiche-technique', label: 'Fiches techniques' },
  { href: '/vendeurs', label: 'Vendeurs professionnels' },
  { href: '/produits', label: 'Boutique' }
]

export default function Footer() {
  return (
    <footer className='bg-ink-950 text-white'>
      <div className='mx-auto w-[94%] lg:w-[88%] xl:max-w-6xl py-8 lg:py-10'>
        <div className='flex flex-col gap-6 md:flex-row md:items-start md:justify-between'>
          <div className='max-w-sm'>
            <img
              src='/logo.svg'
              alt='autocentral.tn'
              className='h-14 lg:h-16 -ml-1'
            />
            <p className='mt-1 text-xs lg:text-sm text-white/60'>
              Le moteur de recherche de voitures d&apos;occasion en Tunisie.
            </p>
          </div>

          <nav aria-label='Pied de page'>
            <h2 className='mb-2 text-xs font-semibold uppercase tracking-wider text-white/40'>
              Navigation
            </h2>
            <ul className='space-y-1.5'>
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-sm text-white/70 transition-colors hover:text-white hover:underline'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className='mb-2 text-xs font-semibold uppercase tracking-wider text-white/40'>
              Suivez-nous
            </h2>
            <div className='flex flex-row gap-2'>
              <a
                href='https://www.instagram.com/autocentral.tn'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Instagram'
                className='rounded-lg bg-white/5 p-2 transition-colors hover:bg-white/15'
              >
                <img
                  src='/instagram.svg'
                  alt=''
                  aria-hidden='true'
                  className='h-5 w-5'
                />
              </a>
              <a
                href='https://www.facebook.com/autocentral.tn'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Facebook'
                className='rounded-lg bg-white/5 p-2 transition-colors hover:bg-white/15'
              >
                <img
                  src='/facebook.svg'
                  alt=''
                  aria-hidden='true'
                  className='h-5 w-5'
                />
              </a>
            </div>
          </div>
        </div>

        <div className='mt-8 border-t border-white/10 pt-4 text-center text-[0.7rem] lg:text-xs text-white/40'>
          Site web non-commercial 100% gratuit — {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  )
}
