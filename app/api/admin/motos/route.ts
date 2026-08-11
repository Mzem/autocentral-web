import { NextRequest } from 'next/server'
import { getMotos } from '../../../../api/services/moto-posts.service'
import { apiErrorResponse } from '../../_apiError'

// Admin-only: motos including hidden ones (validated + scoped server-side).
export async function POST(req: NextRequest) {
  try {
    const { authKey } = await req.json()
    const motos = await getMotos({ includeHidden: true, authKey }, 0)
    return Response.json(motos)
  } catch (e) {
    return apiErrorResponse(e)
  }
}
