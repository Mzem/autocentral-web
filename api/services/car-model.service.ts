import { apiGet } from 'api/apiClient'
import { ApiError } from '../httpClient'

export interface CarModel {
  id: string
  make: {
    id: string
    name: string
    category: string
  }
  model: string
  years: string
  relatedModels: Array<{
    id: string
    productionYears?: string
    engineDetail?: string
    body?: string
    acceleration?: number
    topSpeed?: number
    fuelSystem?: string
    fuelHighway?: string
    fuelUrban?: string
    fuelCombined?: string
  }>
  type?: string
  engineName?: string
  cylinder?: string
  fuel?: string
  hp?: number
  hpRemap?: number
  torque?: number
  torqueRemap?: number
  urlSource?: string
}

export async function getCarModel(id: string): Promise<CarModel | undefined> {
  try {
    const { content } = await apiGet<CarModel>(`car-makes/${id}`)
    return content
  } catch (e) {
    if (e instanceof ApiError) return undefined
    throw e
  }
}
