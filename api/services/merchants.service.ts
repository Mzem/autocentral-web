import { apiGet } from 'api/apiClient'

export interface MerchantListItem {
  id: string
  name: string
  avatar?: string
  isShop: boolean
}

export async function getMerchants(): Promise<MerchantListItem[]> {
  try {
    const { content } = await apiGet<MerchantListItem[]>(`merchants`)
    return content
  } catch (e) {
    console.error('GET merchants error')
    throw e
  }
}
