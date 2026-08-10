import Link from 'next/link'
import { Metadata } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import {
  faCircleCheck,
  faLocationDot,
  faCar,
  faStore,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons'
import { getMerchants } from '../../api/services/merchants.service'

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: 'https://tunisiancars.com.tn/vendeurs'
    },
    description:
      "Les vendeurs professionnels de voitures d'occasion et les showroom dans toute la Tunisie"
  }
}

export default async function Merchants() {
  const merchants = await getMerchants(true)

  return (
    <div className='text-white'>
      <div className='mt-6 flex flex-wrap items-center justify-between gap-3 lg:mt-10'>
        <h1 className='inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight lg:text-3xl'>
          Showrooms &amp; Vendeurs
          <span className='inline-flex items-center gap-1 rounded-full bg-brand-500/15 px-2.5 py-1 text-xs font-bold text-brand-300 ring-1 ring-brand-500/30'>
            <FontAwesomeIcon icon={faCircleCheck} className='h-3.5 w-3.5' />
            PRO
          </span>
        </h1>

        <a
          href='https://m.me/tunisiancars.tn?text=Je%20suis%20un%20vendeur%20PRO%20et%20je%20veux%20avoir%20une%20page%20web%20sur%20Tunisian%20Cars'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90'
        >
          <FontAwesomeIcon icon={faWhatsapp} className='h-4 w-4' />
          Créer votre page vendeur
        </a>
      </div>

      <ul className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-8'>
        {merchants.map((merchant) => (
          <li key={merchant.id}>
            <Link
              href={`/${merchant.id}`}
              className='group flex h-full items-stretch gap-4 overflow-hidden rounded-2xl bg-surface p-3 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-surface-raised hover:ring-brand-500/40'
            >
              {merchant.avatar ? (
                <img
                  src={merchant.avatar}
                  alt={merchant.name}
                  className='h-28 w-28 shrink-0 rounded-xl object-cover'
                />
              ) : (
                <span className='flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400'>
                  <FontAwesomeIcon icon={faStore} className='h-10 w-10' />
                </span>
              )}

              <div className='flex min-w-0 flex-1 flex-col'>
                <div className='flex items-center gap-1.5'>
                  <p className='truncate text-base font-bold lg:text-lg'>
                    {merchant.name}
                  </p>
                  {merchant.isShop && (
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className='h-4 w-4 shrink-0 text-brand-400'
                    />
                  )}
                </div>

                <div className='mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-300 lg:text-sm'>
                  {merchant.regionName && (
                    <span className='inline-flex items-center gap-1'>
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className='h-3.5 w-3.5 text-brand-400'
                      />
                      {merchant.regionName}
                    </span>
                  )}
                  <span className='inline-flex items-center gap-1'>
                    <FontAwesomeIcon
                      icon={faCar}
                      className='h-3.5 w-3.5 text-brand-400'
                    />
                    {merchant.count} annonces
                  </span>
                </div>

                {merchant.description && (
                  <p className='mt-2 line-clamp-2 text-xs leading-relaxed text-ink-400 lg:text-sm'>
                    {merchant.description}
                  </p>
                )}

                <span className='mt-auto inline-flex items-center gap-1 pt-2 text-xs font-semibold text-brand-400 opacity-0 transition-opacity group-hover:opacity-100'>
                  Voir les annonces
                  <FontAwesomeIcon icon={faArrowRight} className='h-3 w-3' />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
