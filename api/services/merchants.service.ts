import { apiGet } from 'api/apiClient'

export interface MerchantListItem {
  id: string
  name: string
  avatar?: string
  isShop: boolean
}

export interface Merchant {
  id: string
  name: string
  isShop: boolean
  categories: string[]
  avatar?: string
  description?: string
  phone?: string
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

export async function getMerchant(id: string): Promise<Merchant> {
  try {
    const { content } = await apiGet<Merchant>(`merchants/${id}`)
    return content
  } catch (e) {
    console.error('GET merchant error')
    throw e
  }
}
