'use client'

import { useState } from 'react'

export default function ShareButton() {
  const [copySuccess, setCopySuccess] = useState(false)

  const handleShare = async () => {
    const currentUrl = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: "J'ai trouvé cette annonce ",
          url: currentUrl
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 3000) // Reset success message
      } catch (error) {
        console.error('Failed to copy link:', error)
      }
    }
  }

  return (
    <button onClick={handleShare} className=''>
      <img
        src='/share.svg'
        alt='Partager'
        className={`h-6 lg:h-10 ${copySuccess ? 'hidden' : ''}`}
      />
      {copySuccess && (
        <span className='italic text-[0.55rem] lg:text-[0.94rem] text-blackopac'>
          Copié
        </span>
      )}
    </button>
  )
}
