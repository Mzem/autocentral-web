'use client'

import { useEffect } from 'react'

const ModalAd = () => {
  useEffect(() => {
    // @ts-expect-error
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        // @ts-expect-error
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (e) {
        console.error('Adsbygoogle error:', e)
      }
    }
  }, [])

  return (
    <ins
      className='adsbygoogle'
      style={{ display: 'block' }}
      data-ad-format='fluid'
      data-ad-layout-key='-fb+5w+4e-db+86'
      data-ad-client='ca-pub-6991672787454088'
      data-ad-slot='1372816097'
    ></ins>
  )
}

export default ModalAd
