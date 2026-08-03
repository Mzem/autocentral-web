import { NextRequest } from 'next/server'
import { syncFacebook } from '../../../../api/services/car-posts.service'
import { apiErrorResponse } from '../../_apiError'

// Admin-only: triggers the on-demand Facebook page scrape ("scrap fb first").
export async function POST(req: NextRequest) {
  const { authKey } = await req.json()
  if (!authKey) return Response.json({ error: 'unauthorized' }, { status: 401 })
  try {
    await syncFacebook(authKey)
    return Response.json({ ok: true })
  } catch (e) {
    return apiErrorResponse(e)
  }
}
