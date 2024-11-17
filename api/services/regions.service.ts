import { apiGet } from 'api/apiClient'
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
    throw e
  }
}
