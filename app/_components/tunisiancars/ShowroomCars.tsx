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
  faLocationDot,
  faClock
} from '@fortawesome/free-solid-svg-icons'
import { CarPostListItem } from '../../../api/services/car-posts.service'
import { dotNumber, noPriceText } from '../../helpers'
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
export default function ShowroomCars({
  posts,
  compact = false,
  replaceNav = false
}: {
  posts: CarPostListItem[]
  // Compact "similar" layout: 2 per row, fixed-height black panel, "Publié"
  // pinned to the bottom. Used inside the detail modal and the estimate modal.
  compact?: boolean
  // Navigate with router.replace so closing (×) returns to the main screen, not
  // the previous listing. Off in the estimate modal so back-nav keeps it open.
  replaceNav?: boolean
}) {
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
    <ul
      className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${
        compact ? '' : 'lg:grid-cols-3'
      }`}
    >
      {posts.map((post, index) => {
        // Tunisian Cars listings (incl. on-behalf) get the "Appeler" pill and
        // the region; scraped/external ones don't.
        const isTC = post.merchant?.id === 'tunisian-cars'
        const inner = (
          <div
            className={`relative flex w-full flex-col overflow-hidden bg-black ${
              compact ? '' : 'aspect-square'
            }`}
          >
            {/* Photo - landscape, top */}
            <div className='relative aspect-[4/3] w-full overflow-hidden bg-white'>
              <RevealCarImage
                src={post.image}
                alt={post.title ?? `${post.make ?? ''} ${post.model ?? ''}`}
              />
              {post.isExpired && (
                <SoldBadge className='absolute left-2.5 top-2.5' />
              )}
              {!post.isExpired && (
                <span className='absolute bottom-2.5 left-2.5 inline-flex items-center rounded-md bg-brand/50 px-2.5 py-1 text-xs font-extrabold text-white shadow'>
                  {post.price
                    ? `${dotNumber(post.price)} DT`
                    : noPriceText(post.merchant?.id)}
                </span>
              )}
              {!post.isExpired && isTC && post.phone && (
                <CallButton
                  phone={post.phone}
                  className='absolute bottom-2.5 right-2.5'
                />
              )}
              <AdminCarControls post={post} />
            </div>

            {/* Details - solid black panel. In the "similar" block it gets a
                fixed height (homogeneous) with "Publié" pinned to the bottom. */}
            <div
              className={`flex flex-col bg-blackopac3 px-3 text-white ${
                compact ? 'py-1 overflow-hidden' : 'flex-1 justify-center'
              }`}
            >
              <h3 className='truncate text-sm font-bold leading-tight lg:text-[0.9rem]'>
                {post.title ?? `${post.make ?? ''} ${post.model ?? ''}`.trim()}
              </h3>

              {/* Line 1: year + km, region pushed to the end (price is on the photo) */}
              <div className='mt-0.5 flex items-center gap-x-1 text-[0.68rem] text-white/85 lg:text-xs'>
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

              {/* "Publié il y a …" — Tunisian Cars only (incl. on-behalf), in
                  every context; sits right after the specs. Uses the publication
                  date (updated_at is churned by the scraper, so it can't stand in
                  for a genuine merchant edit). */}
              {post.publishedAtText && (
                <div className='mt-1.5 flex items-center gap-1 text-[0.6rem] text-white/55'>
                  <FontAwesomeIcon icon={faClock} className='h-2.5 w-2.5' />
                  Publié {post.publishedAtText}
                  {isTC && post.region?.name && (
                    <span className='ml-auto inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap text-white text-[0.68rem]'>
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className='h-3 w-3 text-white'
                      />
                      {post.region.name}
                    </span>
                  )}
                </div>
              )}
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
              // Sold: no navigation - clicking slams a shaking "VENDU" stamp.
              <SoldCard className='overflow-hidden shadow-card-light'>
                {inner}
              </SoldCard>
            ) : (
              <Link
                href={`/annonces/${post.id}`}
                scroll={false}
                replace={replaceNav}
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
