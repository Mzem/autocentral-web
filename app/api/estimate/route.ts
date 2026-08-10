import { NextRequest } from 'next/server'
import { estimateCarPrice } from '../../../api/services/car-posts.service'
import { apiErrorResponse } from '../_apiError'

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const make = sp.get('make')
  const model = sp.get('model')
  const year = Number(sp.get('year'))
  const km = Number(sp.get('km'))
  const cv = Number(sp.get('cv'))

  if (!make || !model || !year || !km || !cv) {
    return Response.json({ enough: false, sampleSize: 0 })
  }

  try {
    const estimate = await estimateCarPrice({
      make,
      model,
      year,
      km,
      cv,
      fuel: sp.get('fuel') || undefined,
      gearbox: sp.get('gearbox') || undefined,
      firstOwner: sp.get('firstOwner') === 'true'
    })
    return Response.json(estimate)
  } catch (e) {
    return apiErrorResponse(e)
  }
}
