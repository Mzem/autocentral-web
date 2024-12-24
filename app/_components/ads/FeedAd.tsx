'use client'

import { useEffect } from 'react'

const FeedAd = () => {
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
      data-ad-layout-key='-gs+x-3x-cq+11v'
      data-ad-client='ca-pub-6991672787454088'
      data-ad-slot='4198159136'
    ></ins>
  )
}

export default FeedAd
