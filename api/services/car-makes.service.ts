import { apiGet } from '../apiClient'
import { ApiError } from '../httpClient'

export interface CarMake {
  id: string
  name: string
  category: string
}

export async function getCarMakes(): Promise<CarMake[]> {
  try {
    const { content } = await apiGet<CarMake[]>(`car-makes`)
    return content
  } catch (e) {
    if (e instanceof ApiError) return []
    throw e
  }
}
