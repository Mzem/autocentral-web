'use client'

import { useState, type ReactNode } from 'react'

/**
 * Wrapper for a SOLD listing on the showroom: it does NOT open the detail.
 * Clicking it slams a shaking "VENDU" stamp over the card (which then fades out)
 * to make clear the car is no longer available.
 */
export default function SoldCard({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  // Incremented on each click so the stamp animation re-runs (via `key`).
  const [pulse, setPulse] = useState(0)

  return (
    <div
      role='button'
      tabIndex={0}
      aria-label='Véhicule vendu'
      onClick={() => setPulse((p) => p + 1)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setPulse((p) => p + 1)
        }
      }}
      className={`group relative block cursor-not-allowed select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
        className ?? ''
      }`}
    >
      {children}

      {pulse > 0 && (
        // Overlay the photo only (its 4:3 height is 75% of the square card).
        <div
          key={pulse}
          className='pointer-events-none absolute inset-x-0 top-0 z-30 flex h-[75%] items-center justify-center'
        >
          <span className='animate-sold-stamp rounded-xl bg-red/60 px-6 py-3 text-3xl font-extrabold uppercase tracking-[0.2em] text-white shadow-2xl lg:text-4xl'>
            Vendu
          </span>
        </div>
      )}
    </div>
  )
}
