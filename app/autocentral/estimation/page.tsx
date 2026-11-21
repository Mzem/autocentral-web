import type { Metadata } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalculator } from '@fortawesome/free-solid-svg-icons'
import EstimateTool from '../../_components/car-posts/EstimateTool'
import {
  estimateCarLabel,
  estimateQueryString,
  isCompleteEstimate,
  parseEstimateParams
} from '../../_lib/estimate'
import { AC_URL } from '../../_lib/site'
import { acPageMetadata } from '../../_lib/site-metadata'

type SearchParams = Record<string, string | string[] | undefined>

const TITLE = 'Estimer mon véhicule - prix du marché en Tunisie | Autocentral'
const DESCRIPTION =
  "Estimez gratuitement le prix de votre voiture d'occasion en Tunisie : une fourchette calculée à partir du prix médian des annonces comparables du marché."

/**
 * A plain /estimation keeps the regular metadata. An estimate URL (opened from
 * a listing's "Estimer" or a shared estimate) gets its own title and a preview
 * image with the car and its range, so the shared link reads well in WhatsApp
 * / Messenger. The canonical stays /estimation (no duplicate pages indexed).
 */
export function generateMetadata({
  searchParams
}: {
  searchParams: SearchParams
}): Metadata {
  const base = acPageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: '/estimation'
  })
  const params = parseEstimateParams(searchParams)
  if (!isCompleteEstimate(params)) return base

  const qs = estimateQueryString(params)
  const title = `Estimation ${estimateCarLabel(params)} | Autocentral`
  const description =
    'Fourchette de prix calculée à partir des annonces comparables du marché tunisien, avec les véhicules similaires en vente.'
  const images = [
    { url: `/api/og/estimate?${qs}`, width: 1200, height: 630, alt: title }
  ]
  return {
    ...base,
    title,
    description,
    openGraph: {
      ...base.openGraph,
      url: `${AC_URL}/estimation?${qs}`,
      title,
      description,
      images
    },
    twitter: { card: 'summary_large_image', title, description, images }
  }
}

/**
 * Price estimate page of autocentral.tn. Same skeleton as the auctions page: a
 * black strip under the fixed header, then the centred content on white.
 */
export default function EstimationPage({
  searchParams
}: {
  searchParams: SearchParams
}) {
  const initial = parseEstimateParams(searchParams)
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

        {/* Re-mounted per URL, so a new pre-filled estimate starts fresh. */}
        <EstimateTool key={estimateQueryString(initial)} initial={initial} />
      </div>
    </div>
  )
}
