import { useEffect } from 'react'

const FeedAd = () => {
  useEffect(() => {
    // @ts-expect-error
    if (window.adsbygoogle && !window.adsbygoogle.loaded) {
      // @ts-expect-error
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    }
  }, [])

  return (
    <div>
      <ins
        className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-format='fluid'
        data-ad-layout-key='-gs+x-3x-cq+11v'
        data-ad-client='ca-pub-6991672787454088'
        data-ad-slot='4198159136'
      ></ins>
    </div>
  )
}

export default FeedAd
