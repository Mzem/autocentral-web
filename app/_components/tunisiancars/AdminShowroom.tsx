'use client'

import { useEffect, useState } from 'react'
import ShowroomCategories from './ShowroomCategories'
import { CarPostListItem } from '../../../api/services/car-posts.service'
import { useMerchantKey } from '../../_lib/useMerchantKey'

/**
 * Wraps the public showroom. For a logged-in merchant it refetches the listing
 * INCLUDING hidden posts (validated + scoped server-side), so the admin can see
 * and unhide them; the public keeps the server-rendered (hidden-free) list.
 *
 * The admin list is re-fetched whenever `initialPosts` changes - i.e. after a
 * `router.refresh()` following an edit/hide - so the admin view never falls back
 * to the (hidden-free, recency-filtered) public list and "loses" its cars.
 */
export default function AdminShowroom({
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
      body: JSON.stringify({ authKey: key })
    })
      .then((r) => r.json())
      .then((data: CarPostListItem[]) => {
        if (cancelled) return
        setPosts(Array.isArray(data) && data.length > 0 ? data : initialPosts)
      })
      .catch(() => {
        if (!cancelled) setPosts(initialPosts)
      })
    return () => {
      cancelled = true
    }
  }, [ready, key, initialPosts])

  return <ShowroomCategories posts={posts} />
}
