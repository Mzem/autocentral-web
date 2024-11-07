import { apiGet, apiPatch } from 'api/apiClient'
import { Region } from './regions.service'
import { MerchantListItem } from './merchants.service'
import { CarModel } from './car-model.service'
import { ApiError } from '../httpClient'
import { Color, Fuel, InteriorType } from '../../app/types'

export interface CarPostListItem {
  id: string
  source: string
  publishedAt: string
  publishedAtText: string
  region: Region
  merchant: MerchantListItem
  phone: number
  title: string
  image: string
  price: number | undefined
  estimatedPrice: { color: string; text: string; price: number } | undefined
  make: string
  model: string
  year: number
  km: number
  fuel: string
  cv: number
  engine: string
  gearbox: string
  exchange: boolean
  leasing: boolean
  firstOwner: boolean
}

export interface CarPost {
  id: string
  source: string
  urlSource: string | undefined
  publishedAt: string
  publishedAtText: string
  region: Region
  merchant: MerchantListItem
  carEngine: CarModel | undefined
  phone: number | undefined
  title: string | undefined
  description: string | undefined
  images: string[]
  price: number | undefined
  estimatedPrice: { color: string; text: string; value: number } | undefined
  make: string | undefined
  model: string | undefined
  body: string | undefined
  year: number | undefined
  km: number | undefined
  fuel: string | undefined
  cv: number | undefined
  cvTax: string | undefined
  engine: string | undefined
  gearbox: string | undefined
  interiorType: string | undefined
  interiorColor: string | undefined
  transmission: string | undefined
  carPlay: boolean | undefined
  bluetooth: boolean | undefined
  camera: boolean | undefined
  sunroof: boolean | undefined
  alarm: boolean | undefined
  acAuto: boolean | undefined
  ledLights: boolean | undefined
  ledInterior: boolean | undefined
  keyless: boolean | undefined
  aluRims: boolean | undefined
  warranty: boolean | undefined
  exchange: boolean | undefined
  leasing: boolean | undefined
  firstOwner: boolean | undefined
}

export interface GetCarPostsFilters {
  page: number
  merchantId?: string
  make?: string
  model?: string
  regionIds?: string[]
  fuel?: Fuel[]
  color?: Color[]
  interiorType?: InteriorType[]
  maxPrice?: number
  minPrice?: number
  maxKm?: number
  minKm?: number
  maxYear?: number
  minYear?: number
  maxCV?: number
  minCV?: number
  alarm?: boolean
  keyless?: boolean
  camera?: boolean
  isShop?: boolean
  isAuto?: boolean
  firstOwner?: boolean
  exchange?: boolean
  leasing?: boolean
  q?: string
}

export function generateCarPostsQueryParams(
  filters: GetCarPostsFilters
): string {
  let qp = `?page=${filters.page}`
  if (filters.merchantId) qp += `&merchantId=${filters.merchantId}`
  if (filters.make) qp += `&make=${filters.make}`
  if (filters.model) qp += `&model=${filters.model}`
  if (filters.regionIds)
    filters.regionIds.forEach((regionId) => {
      qp += `&regionIds=${regionId}`
    })
  if (filters.fuel)
    filters.fuel.forEach((fuel) => {
      qp += `&fuel=${fuel}`
    })
  if (filters.color)
    filters.color.forEach((color) => {
      qp += `&color=${color}`
    })
  if (filters.interiorType)
    filters.interiorType.forEach((interiorType) => {
      qp += `&interiorType=${interiorType}`
    })
  if (filters.maxPrice) qp += `&maxPrice=${filters.maxPrice}`
  if (filters.minPrice) qp += `&minPrice=${filters.minPrice}`
  if (filters.maxKm) qp += `&maxKm=${filters.maxKm}`
  if (filters.minKm) qp += `&minKm=${filters.minKm}`
  if (filters.maxYear) qp += `&maxYear=${filters.maxYear}`
  if (filters.minYear) qp += `&minYear=${filters.minYear}`
  if (filters.maxCV) qp += `&maxCV=${filters.maxCV}`
  if (filters.minCV) qp += `&minCV=${filters.minCV}`
  if (filters.alarm) qp += `&alarm=true`
  if (filters.keyless) qp += `&keyless=true`
  if (filters.camera) qp += `&camera=true`
  if (filters.isShop) qp += '&isShop=true'
  if (filters.isAuto) qp += '&isAuto=true'
  if (filters.firstOwner) qp += '&firstOwner=true'
  if (filters.exchange) qp += '&exchange=true'
  if (filters.leasing) qp += '&leasing=true'
  if (filters.q) qp += `&q=${filters.q}`

  return qp
}

export async function getCarPosts(
  filters: GetCarPostsFilters
): Promise<CarPostListItem[]> {
  try {
    const url = 'car-posts/' + generateCarPostsQueryParams(filters)
    const { content } = await apiGet<CarPostListItem[]>(url, 60)
    return content
  } catch (e) {
    console.error('GET car posts error')
    throw e
  }
}

export async function getCarPost(id: string): Promise<CarPost | undefined> {
  try {
    const { content } = await apiGet<CarPost>(`car-posts/${id}`)
    return content
  } catch (e) {
    if (e instanceof ApiError) return undefined
    console.error('GET car post error')
    throw e
  }
}

export async function updateCarPost(
  id: string,
  authKey: string,
  km?: number,
  year?: number,
  price?: number,
  estimation?: number,
  make?: string,
  model?: string
): Promise<void> {
  try {
    await apiPatch(`car-posts/${id}`, {
      authKey,
      km,
      year,
      price,
      estimation,
      make,
      model
    })
  } catch (e) {
    console.error('PATCH car post error')
    throw e
  }
}
