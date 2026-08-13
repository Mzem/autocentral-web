'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
  faExpand,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import { RealisationItem } from '../../../api/services/realisations.service'
import AdminRealisationControls from './AdminRealisationControls'

/**
 * Réalisation card: a swipeable / arrow-navigable photo carousel + title and a
 * 3-line-clamped description. Clicking anywhere on the card (image or text)
 * opens a full-screen viewer with the big image carousel and the full text.
 *
 * Inner controls (carousel arrows, admin edit/delete) stop propagation so they
 * don't open the viewer; a swipe is likewise not treated as a click.
 */
export default function RealisationCard({ item }: { item: RealisationItem }) {
  const images = item.images?.length
    ? item.images
    : item.image
    ? [item.image]
    : []
  const count = images.length

  const [idx, setIdx] = useState(0)
  const [viewerOpen, setViewerOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const swipedRef = useRef(false)

  const go = (dir: number) => {
    if (!count) return
    setIdx((i) => (i + dir + count) % count)
  }

  // Viewer: lock body scroll, close on Esc, navigate with arrow keys.
  useEffect(() => {
    if (!viewerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setViewerOpen(false)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [viewerOpen, count])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (count > 1 && Math.abs(dx) > 40) {
      swipedRef.current = true // suppress the click that follows a swipe
      go(dx < 0 ? 1 : -1)
    }
    touchStartX.current = null
  }

  const onCardClick = () => {
    if (swipedRef.current) {
      swipedRef.current = false
      return
    }
    setViewerOpen(true)
  }

  const roundBtn =
    'flex items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/70'

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={onCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setViewerOpen(true)
        }
      }}
      className='group relative flex cursor-pointer flex-col overflow-hidden rounded-lg bg-white shadow-card-light ring-1 ring-ink-100 transition-shadow hover:shadow-lg'
    >
      <div
        className='relative aspect-[4/3] touch-pan-y overflow-hidden bg-ink-100'
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {count > 0 && (
          <div
            className='flex h-full w-full transition-transform duration-300 ease-out'
            style={{ transform: `translateX(-${idx * 100}%)` }}
          >
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={item.title ?? 'Réalisation'}
                loading='lazy'
                draggable={false}
                className='h-full w-full flex-shrink-0 select-none object-cover'
              />
            ))}
          </div>
        )}

        {count > 1 && (
          <>
            <button
              type='button'
              aria-label='Image précédente'
              onClick={(e) => {
                e.stopPropagation()
                go(-1)
              }}
              className={`${roundBtn} absolute left-2 top-1/2 z-10 h-9 w-9 -translate-y-1/2`}
            >
              <FontAwesomeIcon icon={faChevronLeft} className='h-4 w-4' />
            </button>
            <button
              type='button'
              aria-label='Image suivante'
              onClick={(e) => {
                e.stopPropagation()
                go(1)
              }}
              className={`${roundBtn} absolute right-2 top-1/2 z-10 h-9 w-9 -translate-y-1/2`}
            >
              <FontAwesomeIcon icon={faChevronRight} className='h-4 w-4' />
            </button>
            <div className='pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5'>
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Affordance only — the whole card is clickable, so let clicks pass through. */}
        {count > 0 && (
          <span
            className={`${roundBtn} pointer-events-none absolute bottom-2 left-2 z-10 h-9 w-9 opacity-90`}
          >
            <FontAwesomeIcon icon={faExpand} className='h-4 w-4' />
          </span>
        )}

        {/* Admin controls (and their portal modal) must not bubble to the card. */}
        <div onClick={(e) => e.stopPropagation()}>
          <AdminRealisationControls item={item} />
        </div>
      </div>

      {(item.title || item.description) && (
        <div className='flex flex-1 flex-col p-4'>
          {item.title && (
            <h3 className='line-clamp-2 text-base font-bold text-ink-950 md:min-h-[3rem]'>
              {item.title}
            </h3>
          )}
          {item.description && (
            <p className='mt-1.5 line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-ink-600 md:min-h-[4.25rem]'>
              {item.description}
            </p>
          )}
        </div>
      )}

      {viewerOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className='fixed inset-0 z-[80] flex flex-col bg-black/90 p-4'
            onClick={(e) => {
              // Portal events bubble through the React tree to the card's
              // onClick (which reopens the viewer) — stop them here.
              e.stopPropagation()
              setViewerOpen(false)
            }}
          >
            <button
              type='button'
              aria-label='Fermer'
              onClick={() => setViewerOpen(false)}
              className={`${roundBtn} absolute right-4 top-4 z-20 h-10 w-10`}
            >
              <FontAwesomeIcon icon={faXmark} className='h-5 w-5' />
            </button>

            <div
              className='relative flex min-h-0 flex-1 items-center justify-center'
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {images[idx] && (
                <img
                  src={images[idx]}
                  alt={item.title ?? 'Réalisation'}
                  draggable={false}
                  onClick={(e) => e.stopPropagation()}
                  className='max-h-full max-w-full select-none rounded-lg object-contain'
                />
              )}

              {count > 1 && (
                <>
                  <button
                    type='button'
                    aria-label='Image précédente'
                    onClick={(e) => {
                      e.stopPropagation()
                      go(-1)
                    }}
                    className={`${roundBtn} absolute left-0 top-1/2 h-11 w-11 -translate-y-1/2`}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className='h-5 w-5' />
                  </button>
                  <button
                    type='button'
                    aria-label='Image suivante'
                    onClick={(e) => {
                      e.stopPropagation()
                      go(1)
                    }}
                    className={`${roundBtn} absolute right-0 top-1/2 h-11 w-11 -translate-y-1/2`}
                  >
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className='h-5 w-5'
                    />
                  </button>
                </>
              )}
            </div>

            {count > 1 && (
              <div className='mt-3 flex justify-center gap-1.5'>
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {(item.title || item.description) && (
              <div
                onClick={(e) => e.stopPropagation()}
                className='mx-auto mt-3 max-h-[28vh] w-full max-w-3xl overflow-y-auto text-white'
              >
                {item.title && (
                  <h3 className='text-lg font-bold'>{item.title}</h3>
                )}
                {item.description && (
                  <p className='mt-1.5 whitespace-pre-line text-sm leading-relaxed text-white/80'>
                    {item.description}
                  </p>
                )}
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  )
}
