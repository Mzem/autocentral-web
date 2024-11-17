import { apiGet } from 'api/apiClient'
import { ApiError } from '../httpClient'
import { CarMake } from './car-makes.service'

export interface CarModel {
  id: string
  make: CarMake
  model: string
  fromYear: string
  type?: string
  vmax?: number
  acceleration?: string
  cv?: number
  pbs?: string
  note?: number
  nbCylinder?: number
  urban?: number
  highway?: number
  engineName?: string
  cylinder?: string
  fuel?: string
  hp?: number
  hpStage1?: number
  hpStage2?: number
  torque?: number
  torqueStage1?: number
  torqueStage2?: number
  urlSource?: string
}

interface Engine {
  id: string
  type?: string
  year: string
  engineName?: string
  cylinder?: string
  fuel?: string
  hp?: number
}
interface ModelYearListItem {
  year: string
  engines: Engine[]
}

export interface ModelListItem {
  modelName: string
  modelYears: ModelYearListItem[]
}

export interface CarModelsByMake {
  make: CarMake
  models: ModelListItem[]
}

export async function getCarModel(id: string): Promise<CarModel | undefined> {
  try {
    const { content } = await apiGet<CarModel>(`car-models/models/${id}`, 3600)
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
      `car-models/makes/${makeId}/models`,
      3600
    )
    return content
  } catch (e) {
    if (e instanceof ApiError) return undefined
    throw e
  }
}
