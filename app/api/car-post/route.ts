import { NextRequest } from 'next/server'
import { getCarPost } from '../../../api/services/car-posts.service'

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get('postId')!
  const post = await getCarPost(postId)

  return Response.json(post)
}
