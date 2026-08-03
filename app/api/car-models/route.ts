import { NextRequest } from 'next/server'
import { getCarModelsByMake } from '../../../api/services/car-model.service'

export async function GET(req: NextRequest) {
  const makeId = req.nextUrl.searchParams.get('makeId')
  if (!makeId) return Response.json({ models: [] })
  const data = await getCarModelsByMake(makeId)
  return Response.json(data ?? { models: [] })
}
