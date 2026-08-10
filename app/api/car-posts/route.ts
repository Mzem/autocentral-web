import { NextRequest } from 'next/server'
import { getCarPosts } from '../../../api/services/car-posts.service'
import { fromQueryParamsToGetCarPostsFilters } from '../../helpers'

export async function GET(req: NextRequest) {
  const filters = fromQueryParamsToGetCarPostsFilters(
    undefined,
    req.nextUrl.searchParams
  )
  // No cache: filter/search results must reflect the latest data immediately.
  const posts = await getCarPosts(filters, 0)
  return Response.json(posts)
}
