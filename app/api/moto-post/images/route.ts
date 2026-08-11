import { NextRequest } from 'next/server'
import { updateMotoImages } from '../../../../api/services/moto-posts.service'
import { apiErrorResponse } from '../../_apiError'

export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('postId')!
  try {
    const formData = await req.formData()
    await updateMotoImages(id, formData)
    return Response.json({ message: 'ok' }, { status: 200 })
  } catch (e) {
    return apiErrorResponse(e)
  }
}
