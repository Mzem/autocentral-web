'use client'

import NextTopLoader from 'nextjs-toploader'

export default function ProgressBar() {
  return (
    <NextTopLoader
      color='#6b0000'
      showSpinner={true}
      height={5}
      crawlSpeed={100}
    />
  )
}
