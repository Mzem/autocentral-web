import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { updateMerchItemImages } from '../../../../api/services/merch-items.service'
import { apiErrorResponse } from '../../_apiError'

export async function PATCH(req: NextRequest) {
  const itemId = req.nextUrl.searchParams.get('itemId')
  if (!itemId)
    return Response.json({ error: 'missing itemId' }, { status: 400 })
  try {
    const formData = await req.formData()
    await updateMerchItemImages(itemId, formData)
    revalidatePath('/produits')
    return Response.json({ message: 'ok' }, { status: 200 })
  } catch (e) {
    return apiErrorResponse(e)
  }
}
