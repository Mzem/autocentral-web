import { NextRequest } from 'next/server'
import { getRealisations } from '../../../../api/services/realisations.service'
import { apiErrorResponse } from '../../_apiError'

// Admin-only: réalisations including hidden ones (validated + scoped server-side).
export async function POST(req: NextRequest) {
  try {
    const { authKey } = await req.json()
    const items = await getRealisations({ includeHidden: true, authKey }, 0)
    return Response.json(items)
  } catch (e) {
    return apiErrorResponse(e)
  }
}
