import { NextRequest } from 'next/server'
import { getCarPosts } from '../../../../api/services/car-posts.service'

// Admin-only: returns the merchant's listings INCLUDING hidden ones. The API
// re-validates the key and scopes results to that merchant.
export async function POST(req: NextRequest) {
  const { authKey } = await req.json()
  if (!authKey) return Response.json([], { status: 200 })
  try {
    // No cache: the admin view must reflect edits (sold / hidden…) immediately,
    // not a 60s-stale list.
    const posts = await getCarPosts(
      { page: 1, includeHidden: true, authKey },
      0
    )
    return Response.json(posts)
  } catch {
    return Response.json([], { status: 200 })
  }
}
