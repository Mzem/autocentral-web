import Link from 'next/link'
import type { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faCalendarDays,
  faGaugeHigh,
  faGasPump,
  faBolt,
  faGears,
  faClock,
  faArrowTrendDown,
  faArrowTrendUp,
  faEquals
} from '@fortawesome/free-solid-svg-icons'
import { CarPostListItem } from '../../../api/services/car-posts.service'
import { dotNumber, noPriceText } from '../../helpers'
import { fuelLabel } from '../../types'
import CarImage, { SoldBadge } from './CarImage'

/**
 * Standard listing card — the one used on the /annonces feed: a 4:3 photo with
 * the price + market-price symbol, then a black spec panel. No admin controls,
 * no "Appeler", no region, so it is safe to reuse for "similar" blocks where the
 * ShowroomCars edit/delete overlay should NOT appear.
 *
 * Renders a grid <li>; the parent owns the <ul className='grid …'>.
 * `replaceNav` makes the link use router.replace (inside the detail modal, so ×
 * returns to the main screen rather than the previous listing).
 */
export default function CarPostCard({
  post,
  replaceNav = false
}: {
  post: CarPostListItem
  replaceNav?: boolean
}) {
  const spec = (icon: IconDefinition, value: ReactNode) =>
    value ? (
      <span className='inline-flex items-center gap-0.5'>
        <FontAwesomeIcon icon={icon} className='h-3 w-3 text-white' />
        {value}
      </span>
    ) : null

  const estim = post.estimatedPrice
  const estimIcon =
    estim?.color === 'GREEN'
      ? faArrowTrendDown
      : estim?.color === 'RED'
      ? faArrowTrendUp
      : faEquals
  const estimColor =
    estim?.color === 'GREEN'
      ? 'text-success'
      : estim?.color === 'RED'
      ? 'text-danger'
      : 'text-ink-200'

  return (
    <li className='w-full list-none'>
      <Link
        href={`/annonces/${post.id}`}
        scroll={false}
        replace={replaceNav}
        className='group block overflow-hidden shadow-card-light transition-shadow hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
      >
        <div className='relative flex w-full flex-col overflow-hidden bg-black'>
          <div className='relative aspect-[4/3] w-full overflow-hidden bg-ink-900'>
            <CarImage
              src={post.image}
              alt={post.title}
              className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
            />
            {post.isExpired && (
              <SoldBadge className='absolute left-2.5 top-2.5' />
            )}

            {/* Price pill + market-price symbol, together at bottom-left. */}
            <div className='absolute bottom-2.5 left-2.5 flex items-center'>
              <span
                className={`mr-4 inline-flex h-7 items-center rounded-md px-2.5 text-xs font-extrabold shadow ${
                  post.price
                    ? 'bg-brand/50 text-white'
                    : 'bg-black/55 text-white backdrop-blur-sm'
                }`}
              >
                {post.price
                  ? `${dotNumber(post.price)} DT`
                  : estim
                  ? `${dotNumber(estim.value)} DT estimé`
                  : noPriceText(post.merchant?.id)}
              </span>

              {post.price && estim && (
                <span
                  title={estim.text}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/55 text-sm backdrop-blur-sm ${estimColor}`}
                >
                  <FontAwesomeIcon icon={estimIcon} className='h-3.5 w-3.5' />
                </span>
              )}
            </div>
          </div>

          <div className='flex flex-col overflow-hidden bg-blackopac3 px-3 py-1.5 text-white'>
            <h3 className='truncate text-sm font-bold leading-tight lg:text-[0.95rem]'>
              {post.title || `${post.make ?? ''} ${post.model ?? ''}`.trim()}
            </h3>
            <div className='mt-0.5 flex flex-wrap items-center gap-x-2 text-[0.68rem] text-white/85 lg:text-xs'>
              {spec(faCalendarDays, post.year)}
              {spec(
                faGaugeHigh,
                post.km != null ? `${dotNumber(post.km)} km` : null
              )}
            </div>
            <div className='mt-0.5 flex flex-wrap items-center gap-x-1 text-[0.68rem] text-white/85 lg:text-xs'>
              {spec(faGasPump, fuelLabel(post.fuel))}
              {spec(faBolt, post.cv ? `${post.cv} cv` : null)}
              {spec(faGears, post.gearbox)}
            </div>
            {post.publishedAtText && (
              <div className='mt-1.5 flex items-center gap-1 text-[0.6rem] text-white/55'>
                <FontAwesomeIcon icon={faClock} className='h-2.5 w-2.5' />
                Publié {post.publishedAtText}
              </div>
            )}
          </div>
        </div>
      </Link>
    </li>
  )
}
