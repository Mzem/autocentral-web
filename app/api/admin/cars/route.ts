import { NextRequest } from 'next/server'
import {
  CarPostListItem,
  getCarPosts
} from '../../../../api/services/car-posts.service'

// Admin-only: returns the merchant's listings INCLUDING hidden ones. The API
// re-validates the key and scopes results to the merchants it manages.
// Optional `merchantIds`: listings of those merchants (the featured sellers of
// the Autocentral home) instead of the key's own merchant.
export async function POST(req: NextRequest) {
  const { authKey, merchantIds } = await req.json()
  if (!authKey) return Response.json([], { status: 200 })
  // No cache: the admin view must reflect edits (sold / hidden…) immediately,
  // not a 60s-stale list.
  try {
    if (Array.isArray(merchantIds) && merchantIds.length > 0) {
      const lists = await Promise.all(
        merchantIds
          .filter((id): id is string => typeof id === 'string')
          .map((merchantId) =>
            getCarPosts(
              { page: 1, includeHidden: true, authKey, merchantId },
              0
            ).catch(() => [] as CarPostListItem[])
          )
      )
      // The API falls back to the key's own merchant for one it doesn't
      // manage: keep each list to the merchant asked for.
      return Response.json(
        lists.flatMap((posts, i) =>
          posts.filter((p) => p.merchant?.id === merchantIds[i])
        )
      )
    }
    const posts = await getCarPosts(
      { page: 1, includeHidden: true, authKey },
      0
    )
    return Response.json(posts)
  } catch {
    return Response.json([], { status: 200 })
  }
}
