import React from 'react'
import Link from 'next/link'
import { CarPostListItem } from '../../../api/services/car-posts.service'
import { dotNumber } from '../../helpers'
import CarImage, { SoldBadge } from './CarImage'

/**
 * "Voitures similaires" block shown at the bottom of a listing.
 *
 * Rendered on the server as plain links (rather than modal buttons) so the
 * related listings are crawlable and keep working without JavaScript.
 */
export default function SimilarCarPosts({
  posts
}: {
  posts: CarPostListItem[]
}) {
  if (!posts || posts.length === 0) return null

  return (
    <section
      aria-label='Voitures similaires'
      className='mt-8 lg:mt-12 border-t border-white/10 pt-6 lg:pt-8'
    >
      <h2 className='mb-4 lg:mb-6 text-base lg:text-xl font-bold text-white'>
        Voitures similaires
      </h2>

      <ul className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4'>
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/annonces/${post.id}`}
              className='group flex h-full flex-col overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:ring-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
            >
              <div className='relative aspect-[4/3] overflow-hidden bg-surface-raised'>
                <CarImage
                  src={post.image}
                  alt={post.title ?? `${post.make ?? ''} ${post.model ?? ''}`}
                  className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                />
                {post.isExpired && (
                  <SoldBadge className='absolute top-2 left-2' />
                )}
              </div>

              <div className='flex flex-1 flex-col p-2.5 lg:p-3'>
                <h3 className='truncate text-[0.72rem] lg:text-sm font-semibold text-ink-100'>
                  {post.title ??
                    `${post.make ?? ''} ${post.model ?? ''}`.trim()}
                </h3>

                <p className='mt-0.5 truncate text-[0.65rem] lg:text-xs text-ink-400'>
                  {[post.year, post.km ? `${dotNumber(post.km)} km` : null]
                    .filter(Boolean)
                    .join(' • ')}
                </p>

                <span className='mt-auto pt-2 text-[0.8rem] lg:text-base font-extrabold text-white'>
                  {post.price ? `${dotNumber(post.price)} DT` : 'Prix N.C.'}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
