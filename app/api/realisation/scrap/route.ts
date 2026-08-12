import { NextRequest } from 'next/server'
import { scrapRealisations } from '../../../../api/services/realisations.service'
import { apiErrorResponse } from '../../_apiError'

export async function POST(req: NextRequest) {
  try {
    const { authKey } = await req.json()
    const result = await scrapRealisations(authKey)
    return Response.json(result)
  } catch (e) {
    return apiErrorResponse(e)
  }
}
