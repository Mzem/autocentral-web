'use client'

import { useEffect, useRef, useState } from 'react'
import CarImage from '../car-posts/CarImage'

/**
 * Car photo that reveals on scroll: as the card enters the viewport the image
 * eases from zoomed-in + faded to its final 4:3 position, for a smooth entrance.
 * Honours prefers-reduced-motion.
 */
export default function RevealCarImage({
  src,
  alt
}: {
  src?: string
  alt?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className='h-full w-full overflow-hidden'>
      <CarImage
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition-all duration-[800ms] ease-out group-hover:scale-105 ${
          revealed
            ? 'scale-100 opacity-100 blur-0'
            : 'scale-125 opacity-0 blur-[2px]'
        }`}
      />
    </div>
  )
}
