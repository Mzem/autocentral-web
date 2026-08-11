import {
  apiGet,
  apiPatch,
  apiDelete,
  apiPostFormData,
  apiPatchFormData
} from 'api/apiClient'
import { Region } from './regions.service'

export interface MotoListItem {
  id: string
  title?: string
  make?: string
  model?: string
  year?: number
  km?: number
  cc?: number
  price?: number
  description?: string
  image?: string
  images: string[]
  region?: Region
  phone?: string
  phones: string[]
  isExpired: boolean
  isHidden: boolean
  publishedAt?: string
  publishedAtText?: string
}

export async function getMotos(
  opts?: { includeHidden?: boolean; authKey?: string },
  cacheInSeconds = 60
): Promise<MotoListItem[]> {
  try {
    const params = new URLSearchParams()
    if (opts?.includeHidden) params.set('includeHidden', 'true')
    if (opts?.authKey) params.set('authKey', opts.authKey)
    const qs = params.toString()
    const { content } = await apiGet<MotoListItem[]>(
      'moto-posts' + (qs ? `?${qs}` : ''),
      cacheInSeconds
    )
    return content
  } catch (e) {
    console.error('GET motos error')
    return []
  }
}

export async function createMoto(formData: FormData): Promise<unknown> {
  return apiPostFormData('moto-posts', formData)
}

export async function updateMoto(
  id: string,
  payload: { [key: string]: unknown }
): Promise<void> {
  await apiPatch(`moto-posts/${id}`, payload)
}

export async function deleteMoto(id: string, authKey: string): Promise<void> {
  await apiDelete(`moto-posts/${id}`, { authKey })
}

export async function updateMotoImages(
  id: string,
  formData: FormData
): Promise<unknown> {
  return apiPatchFormData(`moto-posts/${id}/images`, formData)
}
