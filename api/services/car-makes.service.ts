import { apiGet } from '../apiClient'
import { ApiError } from '../httpClient'

export interface CarMake {
  id: string
  name: string
  category?: string
  remap: boolean
}

export async function getCarMakes(remap?: boolean): Promise<CarMake[]> {
  try {
    const { content } = await apiGet<CarMake[]>(`car-makes`, 3600)
    const carMakes = content
    if (remap) return carMakes.filter((make) => make.remap === remap)
    return carMakes
  } catch (e) {
    if (e instanceof ApiError) return []
    throw e
  }
}
