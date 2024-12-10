import { NextRequest } from 'next/server'
import {
  getCarPost,
  updateCarPost
} from '../../../api/services/car-posts.service'

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get('postId')!
  const post = await getCarPost(postId)
  if (!post) return Response.json({})
  return Response.json(post)
}
export async function PATCH(req: NextRequest) {
  const {
    postId,
    authKey,
    km,
    year,
    price,
    estimation,
    make,
    model,
    cylinder,
    title,
    gearbox,
    fuel,
    isFeatured
  } = await req.json()

  await updateCarPost(
    postId,
    authKey,
    Number(km),
    Number(year),
    Number(price),
    Number(estimation),
    make,
    model,
    cylinder,
    title,
    gearbox,
    fuel,
    isFeatured
  )
  return Response.json({ message: 'ok' }, { status: 200 })
}
