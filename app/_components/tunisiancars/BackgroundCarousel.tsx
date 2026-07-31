'use client'

import { useEffect, useState } from 'react'

/**
 * Full-bleed background carousel.
 *
 * - The image list comes from the server (a folder read), so it stays in sync
 *   with `/public` with no code change.
 * - The order is reshuffled on every mount (client-side, after hydration to
 *   avoid a mismatch), so the sequence feels alive rather than fixed.
 * - Layers cross-fade and the active one gets a slow Ken-Burns zoom for a
 *   premium, cinematic feel.
 */
function shuffle<T>(input: T[]): T[] {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function BackgroundCarousel({
  images,
  intervalMs = 6000,
  overlayClassName = 'bg-black/55'
}: {
  images: string[]
  intervalMs?: number
  overlayClassName?: string
}) {
  const [order, setOrder] = useState(images)
  const [index, setIndex] = useState(0)

  // Reshuffle after mount (keeps SSR/CSR markup identical, then randomises).
  useEffect(() => {
    setOrder(shuffle(images))
    setIndex(0)
  }, [images])

  useEffect(() => {
    if (order.length <= 1) return
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % order.length),
      intervalMs
    )
    return () => clearInterval(timer)
  }, [order.length, intervalMs])

  return (
    <div aria-hidden='true' className='absolute inset-0 overflow-hidden'>
      {order.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={src} alt='' className='h-full w-full object-cover' />
        </div>
      ))}
      {/* Base darkening for text legibility. */}
      <div className={`absolute inset-0 ${overlayClassName}`} />
      {/* Slowly drifting vignette — a moving halo of shadow. */}
      <div className='pointer-events-none absolute inset-[-15%] animate-halo bg-[radial-gradient(circle_at_center,transparent_28%,rgba(0,0,0,0.42)_78%)]' />
    </div>
  )
}
