import { NextRequest } from 'next/server'
import { getCarPosts } from '../../../api/services/car-posts.service'
import { fromQueryParamsToGetCarPostsFilters } from '../../helpers'
import { postLog } from '../../../api/services/log.service'

export async function GET(req: NextRequest) {
  const filters = fromQueryParamsToGetCarPostsFilters(
    undefined,
    req.nextUrl.searchParams
  )
  const posts = await getCarPosts(filters)
  return Response.json(posts)
}

export async function POST(req: NextRequest) {
  const { message } = await req.json()

  await postLog(message)
  return Response.json({ message: 'ok' }, { status: 200 })
}
