'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

/** Pre-written WhatsApp message about a listing (cards + detail). */
export function whatsappListingUrl(
  digits: string,
  title: string,
  postUrl: string
): string {
  return `https://wa.me/${digits}?text=${encodeURIComponent(
    `Bonjour, votre annonce ${title} m'intéresse - ${postUrl}`
  )}`
}

/**
 * Small WhatsApp pill overlaid on a listing's photo, next to "Appeler". Opens
 * a pre-written message about the listing, without triggering the card link.
 */
export default function WhatsAppButton({
  whatsapp,
  title,
  postUrl,
  className
}: {
  whatsapp: string
  title: string
  postUrl: string
  className?: string
}) {
  const digits = whatsapp.replace(/\D/g, '')
  return (
    <button
      type='button'
      aria-label='Contacter sur WhatsApp'
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        window.open(
          whatsappListingUrl(digits, title, postUrl),
          '_blank',
          'noopener,noreferrer'
        )
      }}
      className={`inline-flex h-[1.625rem] items-center justify-center rounded-md bg-whatsapp px-2 text-white shadow transition hover:opacity-90 ${
        className ?? ''
      }`}
    >
      <FontAwesomeIcon icon={faWhatsapp} className='h-4 w-4' />
    </button>
  )
}
