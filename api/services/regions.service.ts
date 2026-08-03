import { apiGet } from 'api/apiClient'
import { ApiError } from '../httpClient'
export interface Region {
  id: string
  name: string
}
export async function getRegions(): Promise<Region[]> {
  try {
    const { content } = await apiGet<Region[]>(`regions`)
    return content
  } catch (e) {
    console.error('GET REGIONS ERROR')
    if (e instanceof ApiError) return []
    throw e
  }
}
