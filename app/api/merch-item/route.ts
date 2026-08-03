import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import {
  createMerchItem,
  deleteMerchItem,
  updateMerchItem
} from '../../../api/services/merch-items.service'
import { apiErrorResponse } from '../_apiError'

const num = (v: unknown) =>
  v === undefined || v === null || v === '' ? undefined : Number(v)

// Bust the boutique's cached data so edits/deletes show up on the next refresh.
function revalidateBoutique() {
  revalidatePath('/produits')
}

export async function PATCH(req: NextRequest) {
  const { itemId, authKey, title, description, price, category, inStock } =
    await req.json()
  try {
    await updateMerchItem(itemId, authKey, {
      title: title || undefined,
      description: description || undefined,
      price: num(price),
      category: category || undefined,
      inStock
    })
    revalidateBoutique()
    return Response.json({ message: 'ok' }, { status: 200 })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function DELETE(req: NextRequest) {
  const { itemId, authKey } = await req.json()
  try {
    await deleteMerchItem(itemId, authKey)
    revalidateBoutique()
    return Response.json({ message: 'ok' }, { status: 200 })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    await createMerchItem(formData)
    revalidateBoutique()
    return Response.json({ message: 'ok' }, { status: 201 })
  } catch (e) {
    return apiErrorResponse(e)
  }
}
