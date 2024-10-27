import { NextRequest } from 'next/server'
import { getCarPosts } from '../../../api/services/car-posts.service'
import { fromQueryParamsToGetCarPostsFilters } from '../../helpers'

export async function GET(req: NextRequest) {
  const filters = fromQueryParamsToGetCarPostsFilters(
    undefined,
    req.nextUrl.searchParams
  )
  const posts = await getCarPosts(filters)
  return Response.json(posts)
}
