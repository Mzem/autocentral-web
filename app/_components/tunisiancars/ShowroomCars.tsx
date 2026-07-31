import Link from 'next/link'
import { CarPostListItem } from '../../../api/services/car-posts.service'
import { dotNumber } from '../../helpers'
import CarImage, { SoldBadge } from '../car-posts/CarImage'

/**
 * Showroom grid for the home — the Tunisian Cars seller's own listings, on a
 * light section. Same card language as the old "à la une" block but light,
 * unlimited (not capped at 3) and rendered as crawlable links to the detail
 * page rather than modal buttons.
 */
export default function ShowroomCars({ posts }: { posts: CarPostListItem[] }) {
  if (!posts || posts.length === 0) {
    return (
      <div className='rounded-2xl border border-dashed border-ink-200 bg-ink-50 px-6 py-16 text-center'>
        <p className='text-ink-600'>
          Aucun véhicule disponible pour le moment — de nouvelles pièces
          d&apos;exception arrivent très bientôt.
        </p>
      </div>
    )
  }

  return (
    <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6'>
      {posts.map((post, index) => (
        <li
          key={post.id}
          className='animate-fade-in-up'
          style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
        >
          <Link
            href={`/annonces/${post.id}`}
            className='group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-card-light transition-all duration-300 hover:-translate-y-1 hover:shadow-card-light-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
          >
            <div className='relative aspect-[16/10] overflow-hidden bg-ink-100'>
              <CarImage
                src={post.image}
                alt={post.title ?? `${post.make ?? ''} ${post.model ?? ''}`}
                className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
              />
              {post.isExpired && (
                <SoldBadge className='absolute top-3 left-3' />
              )}
            </div>

            <div className='flex flex-1 flex-col p-4'>
              <h3 className='truncate font-bold text-ink-950'>
                {post.title ?? `${post.make ?? ''} ${post.model ?? ''}`.trim()}
              </h3>
              <p className='mt-0.5 truncate text-xs text-ink-500'>
                {[post.year, post.make, post.model].filter(Boolean).join(' ')}
              </p>

              <div className='mt-3 flex items-baseline justify-between gap-2'>
                <span className='font-extrabold text-lg text-ink-950'>
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

              <dl className='mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500'>
                {post.km !== undefined && post.km !== null && (
                  <div className='flex items-center gap-1'>
                    <dt className='sr-only'>Kilométrage</dt>
                    <dd className='font-semibold text-ink-700'>
                      {dotNumber(post.km)} km
                    </dd>
                  </div>
                )}
                {post.fuel && (
                  <div className="flex items-center gap-1 before:content-['•'] before:text-ink-300">
                    <dt className='sr-only'>Carburant</dt>
                    <dd>{post.fuel}</dd>
                  </div>
                )}
                {post.gearbox && (
                  <div className="flex items-center gap-1 before:content-['•'] before:text-ink-300">
                    <dt className='sr-only'>Boîte</dt>
                    <dd>{post.gearbox}</dd>
                  </div>
                )}
              </dl>

              <div className='mt-3 flex items-center justify-between border-t border-ink-100 pt-3'>
                <span className='truncate text-xs text-ink-500'>
                  {post.region?.name}
                </span>
                <span className='shrink-0 text-xs font-semibold text-brand-500 group-hover:underline'>
                  Voir l&apos;annonce →
                </span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
