import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGaugeHigh,
  faGasPump,
  faGears,
  faLocationDot
} from '@fortawesome/free-solid-svg-icons'
import { CarPostListItem } from '../../../api/services/car-posts.service'
import { dotNumber } from '../../helpers'
import CarImage, { SoldBadge } from '../car-posts/CarImage'

/**
 * Reusable car listing (used by the home showroom and the "similar" block).
 *
 * Mobile-first, minimal and square: a square photo with the details centred
 * underneath — no card chrome / borders. On hover the photo zooms and the
 * details gently grow. One per row on mobile, three on desktop. Each card is a
 * plain link to `/annonces/[id]` (crawlable) — the modal interception handles
 * opening it as an overlay while keeping direct URLs working as a full page.
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

  return (
    <ul className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10'>
      {posts.map((post, index) => (
        <li
          key={post.id}
          className='mx-auto w-full max-w-sm animate-fade-in-up lg:max-w-none'
          style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
        >
          <Link
            href={`/annonces/${post.id}`}
            scroll={false}
            className='group block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
          >
            <div className='relative aspect-square w-full overflow-hidden bg-ink-100 shadow-card-light'>
              <CarImage
                src={post.image}
                alt={post.title ?? `${post.make ?? ''} ${post.model ?? ''}`}
                className='h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105'
              />
              {post.isExpired && (
                <SoldBadge className='absolute left-3 top-3' />
              )}
            </div>

            <div className='mt-4 origin-top text-center transition-transform duration-300 ease-out group-hover:scale-[1.05]'>
              <h3 className='truncate font-bold text-ink-950'>
                {post.title ?? `${post.make ?? ''} ${post.model ?? ''}`.trim()}
              </h3>
              <p className='mt-0.5 truncate text-xs text-ink-400'>
                {[post.year, post.make, post.model].filter(Boolean).join(' ')}
              </p>

              <div className='mt-2 flex items-center justify-center gap-2'>
                <span className='text-lg font-extrabold text-ink-950'>
                  {post.price ? `${dotNumber(post.price)} DT` : 'Prix N.C.'}
                </span>
                {post.estimatedPrice && (
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold ${
                      post.estimatedPrice.color === 'GREEN'
                        ? 'bg-success/10 text-success'
                        : post.estimatedPrice.color === 'RED'
                        ? 'bg-danger/10 text-danger'
                        : 'bg-ink-100 text-ink-500'
                    }`}
                  >
                    {post.estimatedPrice.text}
                  </span>
                )}
              </div>

              <div className='mt-2.5 flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5 text-xs text-ink-500'>
                {post.km !== undefined && post.km !== null && (
                  <span className='inline-flex items-center gap-1.5'>
                    <FontAwesomeIcon
                      icon={faGaugeHigh}
                      className='h-3 w-3 text-brand-500'
                    />
                    {dotNumber(post.km)} km
                  </span>
                )}
                {post.fuel && (
                  <span className='inline-flex items-center gap-1.5'>
                    <FontAwesomeIcon
                      icon={faGasPump}
                      className='h-3 w-3 text-brand-500'
                    />
                    {post.fuel}
                  </span>
                )}
                {post.gearbox && (
                  <span className='inline-flex items-center gap-1.5'>
                    <FontAwesomeIcon
                      icon={faGears}
                      className='h-3 w-3 text-brand-500'
                    />
                    {post.gearbox}
                  </span>
                )}
                {post.region?.name && (
                  <span className='inline-flex items-center gap-1.5'>
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className='h-3 w-3 text-brand-500'
                    />
                    {post.region.name}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
