import { apiGet } from 'api/apiClient'
import { ApiError } from '../httpClient'
import { CarMake } from './car-makes.service'

export interface CarModel {
  id: string
  make: CarMake
  model: string
  years: string
  relatedModels: Array<{
    id: string
    productionYears?: string
    engineDetail?: string
    engineType?: string
    body?: string
    hp?: string
    torque?: string
    acceleration?: number
    topSpeed?: number
    driveType?: string
    gearbox?: string
    weight?: string
    height?: string
    width?: string
    length?: string
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

interface Engine {
  id: string
  type?: string
  engineName?: string
  cylinder?: string
  fuel?: string
  hp?: number
}
interface ModelYearsListItem {
  years: string
  engines: Engine[]
}

export interface ModelListItem {
  modelName: string
  modelYears: ModelYearsListItem[]
}

export interface CarModelsByMake {
  make: CarMake
  models: ModelListItem[]
}

export async function getCarModel(id: string): Promise<CarModel | undefined> {
  try {
    const { content } = await apiGet<CarModel>(`car-models/models/${id}`)
    return content
  } catch (e) {
    if (e instanceof ApiError) return undefined
    throw e
  }
}

export async function getCarModelsByMake(
  makeId: string
): Promise<CarModelsByMake | undefined> {
  try {
    const { content } = await apiGet<CarModelsByMake>(
      `car-models/makes/${makeId}/models`
    )
    return content
  } catch (e) {
    if (e instanceof ApiError) return undefined
    throw e
  }
}
