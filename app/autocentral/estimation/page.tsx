import type { Metadata } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalculator } from '@fortawesome/free-solid-svg-icons'
import EstimateTool from '../../_components/car-posts/EstimateTool'
import { acPageMetadata } from '../../_lib/site-metadata'

export const metadata: Metadata = acPageMetadata({
  title: 'Estimer mon véhicule - prix du marché en Tunisie | Autocentral',
  description:
    "Estimez gratuitement le prix de votre voiture d'occasion en Tunisie : une fourchette calculée à partir du prix médian des annonces comparables du marché.",
  path: '/estimation'
})

/**
 * Price estimate page of autocentral.tn. Same skeleton as the auctions page: a
 * black strip under the fixed header, then the centred content on white.
 */
export default function EstimationPage() {
  return (
    <div className='min-h-screen w-full overflow-x-hidden bg-white pb-10 text-ink-950'>
      <div className='mb-6 h-16 bg-black lg:mb-10' />
      <div className='mx-auto w-[92%] xl:max-w-6xl'>
        <div className='max-w-2xl'>
          <p className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500'>
            <FontAwesomeIcon icon={faCalculator} className='h-4 w-4' />
            Estimation gratuite
          </p>
          <h1 className='mt-3 text-3xl font-extrabold tracking-tight lg:text-4xl'>
            Estimer mon véhicule
          </h1>
          <p className='mt-4 text-pretty leading-relaxed text-ink-600'>
            Renseignez votre véhicule : l&apos;estimation est basée sur le prix
            médian des annonces comparables du marché, avec les véhicules
            similaires actuellement en vente.
          </p>
        </div>

        <EstimateTool />
      </div>
    </div>
  )
}
