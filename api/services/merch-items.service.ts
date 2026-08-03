import {
  apiGet,
  apiPatch,
  apiDelete,
  apiPostFormData,
  apiPatchFormData
} from 'api/apiClient'
import { ApiError } from '../httpClient'

export const MERCH_CATEGORIES = [
  'Vêtements',
  'Miniatures',
  'Décoration',
  'Accessoires'
] as const

export interface MerchItem {
  id: string
  title: string
  description?: string
  images: string[]
  price?: number
  urlSource?: string
  publishedAtText: string
  category: string
  inStock: boolean
  merchant: {
    id: string
    name: string
    regionName?: string
    phone?: string
    avatar?: string
    isShop: boolean
  }
}

export async function getMerchItems(merchantId?: string): Promise<MerchItem[]> {
  try {
    const url = merchantId
      ? `merch-items?merchantId=${encodeURIComponent(merchantId)}`
      : `merch-items`
    const { content } = await apiGet<MerchItem[]>(url)
    return content
  } catch (e) {
    console.error('GET merch items error')
    throw e
  }
}

export async function getMerchItem(id: string): Promise<MerchItem | undefined> {
  try {
    const { content } = await apiGet<MerchItem>(`merch-items/${id}`)
    return content
  } catch (e) {
    if (e instanceof ApiError) return undefined
    console.error('GET merch item error')
    throw e
  }
}

export interface UpdateMerchItemFields {
  title?: string
  description?: string
  price?: number
  category?: string
  inStock?: string
}

export async function updateMerchItem(
  id: string,
  authKey: string,
  fields: UpdateMerchItemFields
): Promise<void> {
  try {
    await apiPatch(`merch-items/${id}`, { authKey, ...fields })
  } catch (e) {
    console.error('PATCH merch item error')
    throw e
  }
}

export async function deleteMerchItem(
  id: string,
  authKey: string
): Promise<void> {
  try {
    await apiDelete(`merch-items/${id}`, { authKey })
  } catch (e) {
    console.error('DELETE merch item error')
    throw e
  }
}

export async function createMerchItem(formData: FormData): Promise<unknown> {
  try {
    return await apiPostFormData('merch-items', formData)
  } catch (e) {
    console.error('POST merch item error')
    throw e
  }
}

export async function updateMerchItemImages(
  id: string,
  formData: FormData
): Promise<unknown> {
  try {
    return await apiPatchFormData(`merch-items/${id}/images`, formData)
  } catch (e) {
    console.error('PATCH merch item images error')
    throw e
  }
}
