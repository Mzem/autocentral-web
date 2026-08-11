import { NextRequest } from 'next/server'
import {
  createMoto,
  deleteMoto,
  updateMoto
} from '../../../api/services/moto-posts.service'
import { apiErrorResponse } from '../_apiError'

const num = (v: unknown) =>
  v === undefined || v === null || v === '' ? undefined : Number(v)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    await createMoto(formData)
    return Response.json({ message: 'ok' }, { status: 201 })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function PATCH(req: NextRequest) {
  const {
    postId,
    authKey,
    title,
    make,
    model,
    description,
    regionId,
    year,
    km,
    cc,
    price,
    phone,
    isExpired,
    isHidden,
    clearPrice
  } = await req.json()
  try {
    await updateMoto(postId, {
      authKey,
      title,
      make,
      model,
      description,
      regionId,
      year: num(year),
      km: num(km),
      cc: num(cc),
      price: num(price),
      phone,
      isExpired,
      isHidden,
      clearPrice
    })
    return Response.json({ message: 'ok' }, { status: 200 })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function DELETE(req: NextRequest) {
  const { postId, authKey } = await req.json()
  try {
    await deleteMoto(postId, authKey)
    return Response.json({ message: 'ok' }, { status: 200 })
  } catch (e) {
    return apiErrorResponse(e)
  }
}
