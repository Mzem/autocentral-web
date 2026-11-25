import { redirect } from 'next/navigation'

export async function fetchJson(
  reqInfo: RequestInfo,
  reqInit?: RequestInit
): Promise<{ content: any; headers: Headers }> {
  const response = await callFetch(reqInfo, reqInit)

  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return { content: await response.json(), headers: response.headers }
  }
  return { content: undefined, headers: response.headers }
}

export async function fetchNoContent(
  reqInfo: RequestInfo,
  reqInit?: RequestInit
): Promise<void> {
  await callFetch(reqInfo, reqInit)
}

// Reads must fail fast when the API is unreachable: without a bound, undici
// waits ~10 s per connect attempt and a page awaiting several calls hangs past
// the router timeout. Normal reads answer in < 5 s. Writes (uploads included)
// are left unbounded on purpose.
const GET_TIMEOUT_MS = Number(process.env.API_TIMEOUT_MS) || 8000

function withReadTimeout(reqInit?: RequestInit): RequestInit | undefined {
  const method = (reqInit?.method || 'GET').toUpperCase()
  if (reqInit?.signal || method !== 'GET') return reqInit
  return { ...reqInit, signal: AbortSignal.timeout(GET_TIMEOUT_MS) }
}

/** URL without its query string (it may carry an authKey), for logs. */
function logPath(reqInfo: RequestInfo): string {
  const url = typeof reqInfo === 'string' ? reqInfo : reqInfo.url
  return url.split('?')[0]
}

async function callFetch(
  reqInfo: RequestInfo,
  reqInit?: RequestInit
): Promise<Response> {
  let reponse: Response
  try {
    reponse = await fetch(reqInfo, withReadTimeout(reqInit))
  } catch (e) {
    const err = e as Error
    const message =
      err.name === 'TimeoutError'
        ? `API timeout after ${GET_TIMEOUT_MS}ms`
        : err.message || 'Unexpected error'
    const error: UnexpectedError = new UnexpectedError(message)
    console.error('fetchJson exception', { ...error, path: logPath(reqInfo) })
    throw error
  }

  if (!reponse.ok) {
    await handleHttpError(reponse)
  }

  return reponse
}

async function handleHttpError(response: Response): Promise<void> {
  if (response.status === 401) {
    const logoutUrl = '/api/auth/federated-logout'
    if (typeof window !== 'undefined') {
      window.location.assign(logoutUrl)
    } else {
      redirect(logoutUrl)
    }
  }

  const json: any = await response.json()
  const message = json?.message || response.statusText
  const error = new ApiError(response.status, message)
  console.error('fetchJson error', error)
  throw error
}

export class ApiError implements Error {
  name = 'API_ERROR'

  constructor(readonly statusCode: number, readonly message: string) {}
}

export class UnexpectedError implements Error {
  name = 'UNEXPECTED_ERROR'

  constructor(readonly message: string) {}
}
