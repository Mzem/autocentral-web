import { apiGet } from 'api/apiClient'
import { ApiError } from '../httpClient'

export interface MerchantListItem {
  id: string
  name: string
  avatar?: string
  isShop: boolean
  phone?: string
}

export interface Merchant {
  id: string
  name: string
  isShop: boolean
  categories: string[]
  avatar?: string
  description?: string
  phone?: string
  phones?: string[]
  insta?: string
  fb?: string
  website?: string
  address?: string
  gmapsLink?: string
  regionName?: string
  regionDetail?: string
  urlTayara?: string
  urlAutomobiletn?: string
  count: number
}

export async function getMerchants(isShop: boolean): Promise<Merchant[]> {
  try {
    const { content } = await apiGet<Merchant[]>(`merchants?isShop=${isShop}`)
    return content
  } catch (e) {
    console.error('GET merchants error')
    throw e
  }
}

export async function getMerchant(id: string): Promise<Merchant | undefined> {
  try {
    const { content } = await apiGet<Merchant>(`merchants/${id}`)
    return content
  } catch (e) {
    if (e instanceof ApiError) return undefined
    console.error('GET merchant error')
    throw e
  }
}
