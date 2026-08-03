'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

/**
 * Light overlay used by the intercepting route so a listing opens as a modal
 * (with the URL updated to /annonces/[id]) while a direct visit / refresh
 * renders the full page. Closing goes back in history, restoring the previous
 * page underneath.
 */
export default function DetailModal({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const close = () => router.back()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [router])

  return (
    <div
      className='fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-1.5 backdrop-blur-sm sm:p-6'
      onClick={close}
    >
      <div
        className='relative mx-auto flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden bg-white/90 text-ink-950 shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermer — reste flottant en haut à droite même en scrollant */}
        <button
          type='button'
          onClick={close}
          aria-label='Fermer'
          className='absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-ink-200 shadow-sm backdrop-blur transition hover:bg-ink-200'
        >
          <FontAwesomeIcon icon={faXmark} className='h-4 w-4' />
        </button>
        <div className='overflow-y-auto p-3'>{children}</div>
      </div>
    </div>
  )
}
