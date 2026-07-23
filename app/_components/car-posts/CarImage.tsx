'use client'

import React, { useState } from 'react'

/**
 * Car listing image that degrades gracefully: if the URL is missing or fails to
 * load (e.g. an external tayara/automobile image the source has since removed),
 * it swaps to an explicit "photo indisponible" placeholder instead of a broken
 * image icon, so the listing still shows.
 */
export default function CarImage({
  src,
  alt,
  className
}: {
  src?: string
  alt?: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        role='img'
        aria-label='Photo indisponible'
        className={`flex flex-col items-center justify-center gap-1 bg-ink-100 text-ink-400 ${
          className ?? ''
        }`}
      >
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.5'
          className='h-8 w-8'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M3 5h13l2 3h3v11H3zM3 5l18 14'
          />
          <circle cx='11' cy='13' r='3' />
        </svg>
        <span className='text-[0.6rem] font-medium uppercase tracking-wide'>
          Photo indisponible
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading='lazy'
      onError={() => setFailed(true)}
      className={className}
    />
  )
}

/** Small "Vendu" ribbon shown on sold (expired) listings. */
export function SoldBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md bg-ink-950/85 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white ${
        className ?? ''
      }`}
    >
      Vendu
    </span>
  )
}
