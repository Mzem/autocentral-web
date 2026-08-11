'use client'

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { CarPostListItem } from '../../../api/services/car-posts.service'
import { dotNumber } from '../../helpers'
import { fuelLabel } from '../../types'
import CarImage, { SoldBadge } from './CarImage'

/**
 * The "à la une" showcase: a small, curated set of highlighted listings shown
 * above the feed with a distinct premium treatment (large visual, steel accent),
 * so they read as a selection rather than as ordinary feed rows.
 */

// The layout is a 3-up grid by design. Capping here as well as in the API keeps
// the block correct even if the endpoint returns more.
const MAX_FEATURED = 3

export default function FeaturedCarPosts({
  posts,
  onSelect
}: {
  posts: CarPostListItem[]
  onSelect: (postId: string) => void
}) {
  const featured = (posts ?? []).slice(0, MAX_FEATURED)
  if (featured.length === 0) return null

  return (
    <section aria-label='Annonces à la une' className='mb-6 lg:mb-10'>
      <header className='flex items-center gap-3 mb-3 lg:mb-5'>
        <span
          aria-hidden='true'
          className='h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/20'
        />
        <h2 className='flex items-center gap-2 text-xs lg:text-sm font-semibold uppercase tracking-[0.18em] text-ink-300'>
          <FontAwesomeIcon
            icon={faStar}
            aria-hidden='true'
            className='h-4 w-4 text-gold-400'
          />
          À la une
        </h2>
        <span
          aria-hidden='true'
          className='h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/20'
        />
      </header>

      <ul className='grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-5'>
        {featured.map((post, index) => (
          <li
            key={post.id}
            className='animate-fade-in-up'
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <button
              type='button'
              onClick={() => onSelect(post.id)}
              className='group relative w-full text-left rounded-2xl overflow-hidden bg-surface shadow-card hover:shadow-featured ring-1 ring-white/10 hover:ring-white/25 transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
            >
              <div className='relative aspect-[16/10] overflow-hidden bg-surface-raised'>
                <CarImage
                  src={post.image}
                  alt={post.title ?? `${post.make ?? ''} ${post.model ?? ''}`}
                  className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <div
                  aria-hidden='true'
                  className='absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/15 to-transparent'
                />

                {post.isExpired ? (
                  <SoldBadge className='absolute top-3 left-3' />
                ) : (
                  <span className='absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-brand-600/95 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white shadow-sm ring-1 ring-white/10'>
                    À la une
                  </span>
                )}

                {post.merchant?.isShop && (
                  <span className='absolute top-3 right-3 rounded-full bg-white/90 px-2 py-1 text-[0.6rem] font-semibold text-ink-300'>
                    Pro
                  </span>
                )}

                <div className='absolute bottom-0 inset-x-0 p-3 lg:p-4'>
                  <h3 className='truncate font-bold text-white text-sm lg:text-base drop-shadow'>
                    {post.title ??
                      `${post.make ?? ''} ${post.model ?? ''}`.trim()}
                  </h3>
                  <p className='mt-0.5 truncate text-[0.7rem] lg:text-xs text-white/80'>
                    {[post.year, post.make, post.model]
                      .filter(Boolean)
                      .join(' ')}
                  </p>
                </div>
              </div>

              <div className='p-3 lg:p-4'>
                <div className='flex items-baseline justify-between gap-2'>
                  <span className='font-extrabold text-base lg:text-lg text-white'>
                    {post.price
                      ? `${dotNumber(post.price)} DT`
                      : 'Prix sur demande'}
                  </span>
                  {post.estimatedPrice && (
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold ${
                        post.estimatedPrice.color === 'GREEN'
                          ? 'bg-success/10 text-success'
                          : post.estimatedPrice.color === 'RED'
                          ? 'bg-danger/10 text-danger'
                          : 'bg-surface-raised text-ink-400'
                      }`}
                    >
                      {post.estimatedPrice.text}
                    </span>
                  )}
                </div>

                <dl className='mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] lg:text-xs text-ink-400'>
                  {post.km !== undefined && post.km !== null && (
                    <div className='flex items-center gap-1'>
                      <dt className='sr-only'>Kilométrage</dt>
                      <dd className='font-semibold text-ink-200'>
                        {dotNumber(post.km)} km
                      </dd>
                    </div>
                  )}
                  {post.fuel && (
                    <div className="flex items-center gap-1 before:content-['•'] before:text-ink-300">
                      <dt className='sr-only'>Carburant</dt>
                      <dd>{fuelLabel(post.fuel)}</dd>
                    </div>
                  )}
                  {post.gearbox && (
                    <div className="flex items-center gap-1 before:content-['•'] before:text-ink-300">
                      <dt className='sr-only'>Boîte</dt>
                      <dd>{post.gearbox}</dd>
                    </div>
                  )}
                </dl>

                <div className='mt-3 flex items-center justify-between border-t border-white/10 pt-2.5'>
                  <span className='truncate text-[0.65rem] lg:text-xs text-ink-400'>
                    {post.region?.name}
                  </span>
                  <span className='shrink-0 text-[0.65rem] lg:text-xs font-semibold text-brand-600 group-hover:underline'>
                    Voir l&apos;annonce →
                  </span>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
