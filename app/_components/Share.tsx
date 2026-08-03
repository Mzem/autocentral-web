'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareNodes, faCheck } from '@fortawesome/free-solid-svg-icons'

/**
 * Share the current URL (native share sheet, or copy-to-clipboard fallback).
 * `className` styles the button; defaults to a plain white icon (dark bg). Pass
 * `label` to also show a "Partager" text.
 */
export default function ShareButton({
  className,
  label
}: {
  className?: string
  label?: boolean
}) {
  const [copySuccess, setCopySuccess] = useState(false)

  const handleShare = async () => {
    const currentUrl = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: "J'ai trouvé cet article ",
          url: currentUrl
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 3000)
      } catch (error) {
        console.error('Failed to copy link:', error)
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      aria-label='Partager'
      className={`inline-flex items-center gap-2 ${className ?? 'text-white'}`}
    >
      <FontAwesomeIcon
        icon={copySuccess ? faCheck : faShareNodes}
        className='h-5 w-5'
      />
      {(label || copySuccess) && (
        <span className='text-sm font-semibold'>
          {copySuccess ? 'Copié' : 'Partager'}
        </span>
      )}
    </button>
  )
}
