import { ApiError } from '../../api/httpClient'

/**
 * Turn an error thrown while calling the backend into a Response that preserves
 * the real status + message, instead of a misleading blanket 401. (On a genuine
 * 401 the backend httpClient throws a Next redirect; we map that back to 401.)
 */
export function apiErrorResponse(e: unknown): Response {
  if (e instanceof ApiError) {
    return Response.json(
      { error: e.message || 'error', status: e.statusCode },
      { status: e.statusCode || 500 }
    )
  }
  if (
    e &&
    typeof e === 'object' &&
    'digest' in e &&
    String((e as { digest?: unknown }).digest).startsWith('NEXT_REDIRECT')
  ) {
    return Response.json(
      { error: 'unauthorized', status: 401 },
      { status: 401 }
    )
  }
  return Response.json({ error: 'server error', status: 500 }, { status: 500 })
}
