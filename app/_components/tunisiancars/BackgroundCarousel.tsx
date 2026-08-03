'use client'

import { useEffect, useState } from 'react'

/**
 * Full-bleed background carousel.
 *
 * - The image list comes from the server (a folder read), already **shuffled**
 *   server-side, so it stays in sync with `/public` with no code change and the
 *   very first image is random per visit — delivered already-loaded in the HTML
 *   (no client-side swap or flash on open).
 * - Implemented as a single sliding rail (`translateX`) rather than per-slide
 *   toggles, so the right → left transition is always visibly rendered
 *   (including on mobile, where the previous "add transition + move in the same
 *   frame" approach made the incoming slide snap instead of glide).
 * - The first image is appended again at the end; once the rail slides onto that
 *   clone it jumps back to the real first slide with no animation, giving a
 *   seamless infinite loop with no visible rewind.
 * - A slowly drifting vignette adds a moving halo of shadow on top.
 */
const DURATION = 1100

export default function BackgroundCarousel({
  images,
  intervalMs = 6000,
  overlayClassName = 'bg-black/55',
  fit = 'cover'
}: {
  images: string[]
  intervalMs?: number
  overlayClassName?: string
  // 'contain' shows the whole image (full width, uncropped) anchored to the top.
  fit?: 'cover' | 'contain'
}) {
  const looping = images.length > 1
  const slides = looping ? [...images, images[0]] : images

  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)

  // Advance one slide at each tick.
  useEffect(() => {
    if (!looping) return
    const timer = setInterval(() => {
      setAnimate(true)
      setIndex((i) => i + 1)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [looping, intervalMs])

  // Once we've slid onto the appended clone of the first image, let the glide
  // finish, then jump back to the real first slide with the transition off.
  useEffect(() => {
    if (!looping || index !== images.length) return
    const t = setTimeout(() => {
      setAnimate(false)
      setIndex(0)
    }, DURATION)
    return () => clearTimeout(t)
  }, [index, images.length, looping])

  // Re-arm the transition on the frame after the instant reset.
  useEffect(() => {
    if (animate) return
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimate(true))
    )
    return () => cancelAnimationFrame(raf)
  }, [animate])

  return (
    <div
      aria-hidden='true'
      className='absolute inset-0 overflow-hidden bg-black'
    >
      <div
        className='flex h-full'
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: animate ? `transform ${DURATION}ms ease-in-out` : 'none'
        }}
      >
        {slides.map((src, i) => (
          <div key={i} className='h-full w-full flex-shrink-0'>
            <img
              src={src}
              alt=''
              className={`h-full w-full ${
                fit === 'contain' ? 'object-contain object-top' : 'object-cover'
              }`}
            />
          </div>
        ))}
      </div>
      {/* Base darkening for text legibility. */}
      <div className={`absolute inset-0 ${overlayClassName}`} />
      {/* Slowly drifting vignette — a moving halo of shadow. */}
      <div className='pointer-events-none absolute inset-[-15%] animate-halo bg-[radial-gradient(circle_at_center,transparent_28%,rgba(0,0,0,0.42)_78%)]' />
    </div>
  )
}
