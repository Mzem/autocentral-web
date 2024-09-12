import { apiGet } from '../apiClient'
import { ApiError } from '../httpClient'

export interface CarReg {
  id: string
  registration: string
  make?: string
  model?: string
  registrationDate?: string
}

export async function getCarReg(reg: string): Promise<CarReg | undefined> {
  try {
    const { content } = await apiGet<CarReg>(`car-regs/${reg}`)
    const carReg = content
    return carReg
  } catch (e) {
    if (e instanceof ApiError) return undefined
    throw e
  }
}
