import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
  apiPostFormData,
  apiPatchFormData
} from 'api/apiClient'

export interface RealisationItem {
  id: string
  title?: string
  description?: string
  image?: string
  images: string[]
  isHidden: boolean
  publishedAt?: string
  publishedAtText?: string
}

export async function getRealisations(
  opts?: { includeHidden?: boolean; authKey?: string },
  cacheInSeconds = 120
): Promise<RealisationItem[]> {
  try {
    const params = new URLSearchParams()
    if (opts?.includeHidden) params.set('includeHidden', 'true')
    if (opts?.authKey) params.set('authKey', opts.authKey)
    const qs = params.toString()
    const { content } = await apiGet<RealisationItem[]>(
      'realisations' + (qs ? `?${qs}` : ''),
      cacheInSeconds
    )
    return content
  } catch (e) {
    console.error('GET realisations error')
    return []
  }
}

export async function createRealisation(formData: FormData): Promise<unknown> {
  return apiPostFormData('realisations', formData)
}

export async function updateRealisation(
  id: string,
  payload: { [key: string]: unknown }
): Promise<void> {
  await apiPatch(`realisations/${id}`, payload)
}

export async function deleteRealisation(
  id: string,
  authKey: string
): Promise<void> {
  await apiDelete(`realisations/${id}`, { authKey })
}

export async function updateRealisationImages(
  id: string,
  formData: FormData
): Promise<unknown> {
  return apiPatchFormData(`realisations/${id}/images`, formData)
}

export async function scrapRealisations(
  authKey: string
): Promise<{ pending: boolean; imported: number }> {
  const { content } = await apiPost<{ pending: boolean; imported: number }>(
    'realisations/scrap',
    { authKey }
  )
  return content
}
