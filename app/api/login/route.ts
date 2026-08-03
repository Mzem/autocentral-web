import { NextRequest } from 'next/server'
import { apiPost } from '../../../api/apiClient'

// Proxies the merchant login to the backend (adding the server-side X-API-KEY),
// and returns the secret key on success.
export async function POST(req: NextRequest) {
  const { id, pwd } = await req.json()
  if (!id || !pwd) {
    return Response.json({ error: 'Champs manquants' }, { status: 400 })
  }
  try {
    const { content } = await apiPost<{ key: string }>('login', { id, pwd })
    return Response.json({ key: content.key })
  } catch {
    return Response.json({ error: 'Identifiants invalides' }, { status: 401 })
  }
}
