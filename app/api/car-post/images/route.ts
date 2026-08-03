import { NextRequest } from 'next/server'
import { updateCarPostImages } from '../../../../api/services/car-posts.service'
import { apiErrorResponse } from '../../_apiError'

export async function PATCH(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get('postId')
  if (!postId)
    return Response.json({ error: 'missing postId' }, { status: 400 })
  try {
    const formData = await req.formData()
    await updateCarPostImages(postId, formData)
    return Response.json({ message: 'ok' }, { status: 200 })
  } catch (e) {
    return apiErrorResponse(e)
  }
}
