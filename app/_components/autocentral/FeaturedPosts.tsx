'use client'

import { useEffect, useState } from 'react'
import { CarPostListItem } from '../../../api/services/car-posts.service'
import { newestFirst } from '../../_lib/featured'
import { FEATURED_MERCHANT_IDS } from '../../_lib/site'
import { useMerchantKey } from '../../_lib/useMerchantKey'
import CarPostCard from '../car-posts/CarPostCard'

// Admin view: how many listings per featured seller (hidden / sold included).
const ADMIN_POSTS_PER_SELLER = 15

/**
 * "Annonces à la une" grid. The public sees the server-rendered list. A
 * logged-in merchant gets the featured sellers' listings INCLUDING hidden and
 * sold ones (validated + scoped by the API), with the edit / hide / sold
 * controls on each card - so a hidden listing can be brought back.
 */
export default function FeaturedPosts({
  initialPosts
}: {
  initialPosts: CarPostListItem[]
}) {
  const { key, ready } = useMerchantKey()
  const [posts, setPosts] = useState<CarPostListItem[]>(initialPosts)

  useEffect(() => {
    if (!ready) return
    if (!key) {
      setPosts(initialPosts)
      return
    }
    let cancelled = false
    fetch('/api/admin/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authKey: key, merchantIds: FEATURED_MERCHANT_IDS })
    })
      .then((r) => r.json())
      .then((data: CarPostListItem[]) => {
        if (cancelled) return
        if (!Array.isArray(data) || data.length === 0) {
          setPosts(initialPosts)
          return
        }
        const perSeller = FEATURED_MERCHANT_IDS.flatMap((id) =>
          newestFirst(
            data.filter((p) => p.merchant?.id === id && !p.isOnBehalf)
          ).slice(0, ADMIN_POSTS_PER_SELLER)
        )
        setPosts(newestFirst(perSeller))
      })
      .catch(() => {
        if (!cancelled) setPosts(initialPosts)
      })
    return () => {
      cancelled = true
    }
  }, [ready, key, initialPosts])

  if (posts.length === 0) {
    return (
      <p className='mt-6 rounded-2xl bg-ink-50 px-6 py-12 text-center text-sm text-ink-500'>
        Les annonces à la une arrivent très bientôt.
      </p>
    )
  }

  return (
    <ul className='mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {posts.map((post) => (
        <CarPostCard key={post.id} post={post} />
      ))}
    </ul>
  )
}
