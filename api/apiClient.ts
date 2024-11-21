import { fetchJson, fetchNoContent } from './httpClient'

const apiURL = process.env.API_URL!
const apiKey = process.env.API_KEY!

export async function apiGet<T>(
  path: string,
  cacheInSeconds: number = 600
): Promise<{ content: T; headers: Headers }> {
  const headers = new Headers({
    'X-API-KEY': apiKey
  })
  return fetchJson(`${apiURL}/${path}`, {
    headers,
    next: {
      revalidate: cacheInSeconds
    }
  })
}

export async function apiPost<T = void>(
  path: string,
  payload: { [key: string]: any }
): Promise<{ content: T; headers: Headers }> {
  const headers = new Headers({
    'X-API-KEY': apiKey,
    'content-type': 'application/json'
  })

  const reqInit: RequestInit = {
    method: 'POST',
    headers
  }
  if (payload && Object.keys(payload).length !== 0)
    reqInit.body = JSON.stringify(payload)

  return fetchJson(`${apiURL}/${path}`, reqInit)
}

export async function apiPostFormData(
  path: string,
  payload: FormData
): Promise<unknown> {
  const headers = new Headers({
    'X-API-KEY': apiKey
  })

  const reqInit: RequestInit = {
    method: 'POST',
    headers
  }
  if (payload) reqInit.body = payload

  const { content }: { content: unknown } = await fetchJson(
    `${apiURL}/${path}`,
    reqInit
  )
  return content
}

export async function apiPut(
  path: string,
  payload: { [key: string]: any }
): Promise<void> {
  const headers = new Headers({
    'X-API-KEY': apiKey,
    'content-type': 'application/json'
  })

  return fetchNoContent(`${apiURL}/${path}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload)
  })
}

export async function apiPatch(
  path: string,
  payload: { [key: string]: any }
): Promise<void> {
  const headers = new Headers({
    'X-API-KEY': apiKey,
    'content-type': 'application/json'
  })

  return fetchNoContent(`${apiURL}/${path}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(payload)
  })
}

export async function apiDelete(path: string): Promise<void> {
  const headers = new Headers({
    'X-API-KEY': apiKey,
    'content-type': 'application/json'
  })

  await fetchNoContent(`${apiURL}/${path}`, {
    method: 'DELETE',
    headers
  })
}
