'use client'

import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
  faXmark,
  faExpand,
  faArrowUpRightFromSquare
} from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons'
import CarImage from '../car-posts/CarImage'

/**
 * Premium image viewer for the listing detail (and the boutique modal).
 *
 * - The main image is always 4:3 landscape (object-cover), centred on top with
 *   the details below.
 * - Font Awesome controls (prev / next / expand / close).
 * - Left/right swipe works on mobile, both inline and in the fullscreen viewer.
 * - When the listing has an external source, a "see contact (& photos)" link to
 *   that source is shown under the image.
 */
export default function DetailGallery({
  images,
  source,
  sourceUrl
}: {
  images: string[]
  source?: string
  sourceUrl?: string
}) {
  const list = images && images.length > 0 ? images : []
  const n = list.length
  const [index, setIndex] = useState(0)
  const [full, setFull] = useState(false)
  // False while the current photo is still loading → show a loader instead of
  // keeping the previous photo on screen during a next/prev navigation.
  const [loaded, setLoaded] = useState(false)
  const startX = useRef<number | null>(null)

  const current = Math.min(index, Math.max(n - 1, 0))
  const go = (dir: number) => {
    if (n <= 1) return
    setLoaded(false)
    setIndex((i) => (i + dir + n) % n)
  }

  const swipe = {
    onTouchStart: (e: React.TouchEvent) => {
      startX.current = e.touches[0].clientX
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (startX.current === null) return
      const dx = e.changedTouches[0].clientX - startX.current
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
      startX.current = null
    }
  }

  const isFB = source === 'facebook.com'
  const isIG = source === 'instagram.com'

  if (n === 0) {
    return (
      <div className='flex aspect-[4/3] w-full items-center justify-center rounded-lg bg-ink-100 text-ink-400'>
        Photo indisponible
      </div>
    )
  }

  const Arrows = ({ big }: { big?: boolean }) =>
    n > 1 ? (
      <>
        <button
          type='button'
          aria-label='Photo précédente'
          onClick={(e) => {
            e.stopPropagation()
            go(-1)
          }}
          className={`absolute left-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg text-white backdrop-blur transition ${
            big
              ? 'h-12 w-12 bg-white/15 hover:bg-white/25'
              : 'h-10 w-10 bg-black/55 hover:bg-black/80'
          }`}
        >
          <FontAwesomeIcon icon={faChevronLeft} className='h-4 w-4' />
        </button>
        <button
          type='button'
          aria-label='Photo suivante'
          onClick={(e) => {
            e.stopPropagation()
            go(1)
          }}
          className={`absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg text-white backdrop-blur transition ${
            big
              ? 'h-12 w-12 bg-white/15 hover:bg-white/25'
              : 'h-10 w-10 bg-black/55 hover:bg-black/80'
          }`}
        >
          <FontAwesomeIcon icon={faChevronRight} className='h-4 w-4' />
        </button>
      </>
    ) : null

  return (
    <div className='flex h-full flex-col gap-3'>
      {/* Image principale - toujours en 4:3 paysage (desktop inclus) */}
      <div
        {...swipe}
        onClick={() => setFull(true)}
        className='relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-ink-100'
      >
        <CarImage
          key={current}
          src={list[current]}
          alt=''
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-200 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {!loaded && (
          <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
            <span className='h-8 w-8 animate-spin rounded-full border-2 border-ink-300 border-t-brand-500' />
          </div>
        )}
        <button
          type='button'
          aria-label='Agrandir'
          onClick={(e) => {
            e.stopPropagation()
            setFull(true)
          }}
          className='absolute bottom-2 left-2 flex h-9 w-9 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur transition hover:bg-black/75'
        >
          <FontAwesomeIcon icon={faExpand} className='h-4 w-4' />
        </button>
        <Arrows />
        {n > 1 && (
          <span className='absolute bottom-2 right-2 rounded-lg bg-black/60 px-2.5 py-1 text-[0.7rem] font-medium text-white backdrop-blur'>
            {current + 1} / {n}
          </span>
        )}
      </div>

      {/* Coordonnées (et photos) sur la source d'origine */}
      {sourceUrl && (
        <a
          href={sourceUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center justify-center gap-2 rounded-lg border border-ink-200 bg-ink-50 px-4 py-2 text-sm font-semibold text-ink-800 transition-colors hover:border-brand-500/40 hover:bg-brand-500/5'
        >
          <FontAwesomeIcon
            icon={
              isFB ? faFacebook : isIG ? faInstagram : faArrowUpRightFromSquare
            }
            className={`h-4 w-4 ${
              isFB
                ? 'text-[#1877F2]'
                : isIG
                ? 'text-[#d62976]'
                : 'text-brand-500'
            }`}
          />
          {isFB || isIG
            ? `Voir coordonnées et photos sur ${
                isFB ? 'Facebook' : 'Instagram'
              }`
            : `Voir coordonnées sur ${source ?? 'la source'}`}
        </a>
      )}

      {/* Plein écran */}
      {full && (
        <div
          {...swipe}
          onClick={() => setFull(false)}
          className='fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-4'
        >
          <img
            key={current}
            src={list[current]}
            alt=''
            onClick={(e) => e.stopPropagation()}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            className={`max-h-[90vh] max-w-[95vw] object-contain transition-opacity duration-200 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {!loaded && (
            <span className='pointer-events-none absolute h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white' />
          )}
          <button
            type='button'
            aria-label='Fermer'
            onClick={() => setFull(false)}
            className='absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur transition hover:bg-white/25'
          >
            <FontAwesomeIcon icon={faXmark} className='h-5 w-5' />
          </button>
          <Arrows big />
          {n > 1 && (
            <span className='absolute bottom-5 left-1/2 -translate-x-1/2 rounded-lg bg-white/15 px-3 py-1 text-sm text-white backdrop-blur'>
              {current + 1} / {n}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
