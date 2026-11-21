'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalculator } from '@fortawesome/free-solid-svg-icons'
import { estimateParamsFromPost, estimationPath } from '../../_lib/estimate'

type PostLike = Parameters<typeof estimateParamsFromPost>[0]

/**
 * Small "Estimer" button next to a "Prix N.C." price: opens the estimate page
 * pre-filled with the listing, which shows the result straight away.
 *
 * `card`: on a listing card, which is itself a link - so a <button> that
 * navigates without triggering the card. `detail`: a plain link.
 */
export default function EstimateButton({
  post,
  variant
}: {
  post: PostLike
  variant: 'card' | 'detail'
}) {
  const router = useRouter()
  const href = estimationPath(estimateParamsFromPost(post))

  if (variant === 'detail') {
    return (
      <Link
        href={href}
        className='inline-flex items-center gap-1.5 rounded-lg bg-ink-100 px-3 py-1.5 text-xs font-semibold text-ink-700 transition-colors hover:bg-ink-200'
      >
        <FontAwesomeIcon icon={faCalculator} className='h-3 w-3' />
        Estimer
      </Link>
    )
  }

  return (
    <button
      type='button'
      aria-label='Estimer le prix de ce véhicule'
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        router.push(href)
      }}
      className='inline-flex h-7 items-center gap-1 rounded-md bg-black/55 px-2 text-[0.65rem] font-semibold text-white backdrop-blur-sm transition hover:bg-black/70'
    >
      <FontAwesomeIcon icon={faCalculator} className='h-3 w-3' />
      Estimer
    </button>
  )
}
