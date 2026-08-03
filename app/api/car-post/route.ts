import { NextRequest } from 'next/server'
import {
  createCarPost,
  deleteCarPost,
  getCarPost,
  updateCarPost
} from '../../../api/services/car-posts.service'
import { apiErrorResponse } from '../_apiError'

const num = (v: unknown) =>
  v === undefined || v === null || v === '' ? undefined : Number(v)

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
    description,
    gearbox,
    fuel,
    cv,
    isFeatured,
    isExpired,
    isHidden,
    clearPrice
  } = await req.json()

  try {
    await updateCarPost(
      postId,
      authKey,
      num(km),
      num(year),
      num(price),
      num(estimation),
      make,
      model,
      cylinder,
      title,
      gearbox,
      fuel,
      isFeatured,
      isExpired,
      isHidden,
      clearPrice,
      num(cv),
      description
    )
    return Response.json({ message: 'ok' }, { status: 200 })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function DELETE(req: NextRequest) {
  const { postId, authKey } = await req.json()
  try {
    await deleteCarPost(postId, authKey)
    return Response.json({ message: 'ok' }, { status: 200 })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    await createCarPost(formData)
    return Response.json({ message: 'ok' }, { status: 201 })
  } catch (e) {
    return apiErrorResponse(e)
  }
}
