import { apiGet } from 'api/apiClient'
import { ApiError } from '../httpClient'

export interface MerchListItem {
  id: string
  title: string
  image: string
  price?: number
}

export interface MerchItem {
  id: string
  title: string
  description?: string
  image: string
  price?: number
}

export async function getMerchItems(): Promise<MerchListItem[]> {
  try {
    const { content } = await apiGet<MerchListItem[]>(`merch-items`)
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
