import { apiGet } from 'api/apiClient'
import { ApiError } from '../httpClient'

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

export async function getMerchItems(): Promise<MerchItem[]> {
  try {
    const { content } = await apiGet<MerchItem[]>(`merch-items`)
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
