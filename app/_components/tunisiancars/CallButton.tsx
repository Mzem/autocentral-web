'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone } from '@fortawesome/free-solid-svg-icons'

/**
 * Small "Appeler" pill overlaid on an available listing's photo. Calls the
 * post's assigned number (Tunisian Cars', or the owner's for on-behalf listings)
 * without triggering the card's link navigation.
 */
export default function CallButton({
  phone,
  className
}: {
  phone: string
  className?: string
}) {
  return (
    <button
      type='button'
      aria-label={`Appeler ${phone}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        window.location.href = `tel:${phone}`
      }}
      className={`inline-flex items-center gap-1.5 rounded-md bg-black/50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow backdrop-blur-sm transition hover:bg-black/60 ${
        className ?? ''
      }`}
    >
      <FontAwesomeIcon icon={faPhone} className='h-3 w-3' />
      Appeler
    </button>
  )
}
