import Link from 'next/link'
import type { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faCalendarDays,
  faGaugeHigh,
  faGasPump,
  faBolt,
  faGears
} from '@fortawesome/free-solid-svg-icons'
import { CarPostListItem } from '../../../api/services/car-posts.service'
import { dotNumber } from '../../helpers'
import { fuelLabel } from '../../types'
import { SoldBadge } from '../car-posts/CarImage'
import RevealCarImage from './RevealCarImage'
import AdminCarControls from './AdminCarControls'
import SoldCard from './SoldCard'
import CallButton from './CallButton'

/**
 * Reusable car listing (home showroom + "similar" block).
 *
 * Each card is a square: a landscape (4:3) photo on top, then a black panel with
 * the details in white text and blue icons. A "Disponible" / "Vendu" badge sits
 * on the photo. Each card links to `/annonces/[id]` (intercepted as a modal).
 */
export default function ShowroomCars({ posts }: { posts: CarPostListItem[] }) {
  if (!posts || posts.length === 0) {
    return (
      <div className='rounded-2xl bg-ink-50 px-6 py-16 text-center'>
        <p className='text-ink-600'>
          Aucun véhicule disponible pour le moment - de nouvelles pièces
          d&apos;exception arrivent très bientôt.
        </p>
      </div>
    )
  }

  const spec = (icon: IconDefinition, value: ReactNode) =>
    value ? (
      <span className='inline-flex items-center gap-0.5'>
        <FontAwesomeIcon icon={icon} className='h-3 w-3 text-white' />
        {value}
      </span>
    ) : null

  return (
    <ul className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {posts.map((post, index) => {
        const inner = (
          <div className='relative flex aspect-square w-full flex-col overflow-hidden bg-black'>
            {/* Photo — landscape, top */}
            <div className='relative aspect-[4/3] w-full overflow-hidden bg-ink-900'>
              <RevealCarImage
                src={post.image}
                alt={post.title ?? `${post.make ?? ''} ${post.model ?? ''}`}
              />
              {post.isExpired && (
                <SoldBadge className='absolute left-2.5 top-2.5' />
              )}
              {!post.isExpired && (
                <span className='absolute bottom-2.5 left-2.5 inline-flex items-center rounded-md bg-brand/50 px-2.5 py-1 text-xs font-extrabold text-brand-50 shadow'>
                  {post.price
                    ? `${dotNumber(post.price)} DT`
                    : 'Prix sur demande'}
                </span>
              )}
              {!post.isExpired && post.phone && (
                <CallButton
                  phone={post.phone}
                  className='absolute bottom-2.5 right-2.5'
                />
              )}
              <AdminCarControls post={post} />
            </div>

            {/* Details — solid black panel */}
            <div className='flex flex-1 flex-col justify-center bg-blackopac3 px-3 py-2 text-white'>
              <h3 className='truncate text-sm font-bold leading-tight lg:text-base'>
                {post.title ?? `${post.make ?? ''} ${post.model ?? ''}`.trim()}
              </h3>

              {/* Line 1: year + km (price now sits on the photo) */}
              <div className='mt-0.5 flex flex-wrap items-center gap-x-1 text-[0.68rem] text-white/85 lg:text-xs'>
                {spec(faCalendarDays, post.year)}
                {spec(
                  faGaugeHigh,
                  post.km != null ? `${dotNumber(post.km)}km` : null
                )}
              </div>

              {/* Line 2: the rest */}
              <div className='mt-0.5 flex flex-wrap items-center gap-x-1 text-[0.68rem] text-white/85 lg:text-xs'>
                {spec(faGasPump, fuelLabel(post.fuel))}
                {spec(faBolt, post.cv ? `${post.cv}cv` : null)}
                {spec(faGears, post.gearbox)}
              </div>
            </div>
          </div>
        )

        return (
          <li
            key={post.id}
            className='mx-auto w-full max-w-sm animate-fade-in-up lg:max-w-none'
            style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
          >
            {post.isExpired ? (
              // Sold: no navigation — clicking slams a shaking "VENDU" stamp.
              <SoldCard className='overflow-hidden shadow-card-light'>
                {inner}
              </SoldCard>
            ) : (
              <Link
                href={`/annonces/${post.id}`}
                scroll={false}
                className='group block overflow-hidden shadow-card-light transition-shadow hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
              >
                {inner}
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  )
}
