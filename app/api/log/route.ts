import { NextRequest } from 'next/server'
import { postLog } from '../../../api/services/log.service'

export async function POST(req: NextRequest) {
  const { message } = await req.json()

  await postLog(message)
  return Response.json({ message: 'ok' }, { status: 200 })
}
