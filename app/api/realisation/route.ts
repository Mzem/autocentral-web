import { NextRequest } from 'next/server'
import {
  createRealisation,
  deleteRealisation,
  updateRealisation
} from '../../../api/services/realisations.service'
import { apiErrorResponse } from '../_apiError'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    await createRealisation(formData)
    return Response.json({ message: 'ok' }, { status: 201 })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function PATCH(req: NextRequest) {
  const { postId, authKey, title, description, isHidden } = await req.json()
  try {
    await updateRealisation(postId, { authKey, title, description, isHidden })
    return Response.json({ message: 'ok' }, { status: 200 })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function DELETE(req: NextRequest) {
  const { postId, authKey } = await req.json()
  try {
    await deleteRealisation(postId, authKey)
    return Response.json({ message: 'ok' }, { status: 200 })
  } catch (e) {
    return apiErrorResponse(e)
  }
}
