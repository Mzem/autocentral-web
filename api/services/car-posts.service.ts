import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
  apiPostFormData,
  apiPatchFormData
} from 'api/apiClient'
import { MerchantListItem } from './merchants.service'
import { Region } from './regions.service'
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
  phone: string
  title: string
  image: string
  price: number | undefined
  estimatedPrice: { color: string; text: string; value: number } | undefined
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
  isExpired: boolean | undefined
  isHidden: boolean | undefined
  isOnBehalf: boolean | undefined
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
  phone: string | undefined
  phones: string[] | undefined
  title: string | undefined
  description: string | undefined
  images: string[]
  thumbnail: string | undefined
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
  cylinder: string | undefined
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
  options: string[] | undefined
  whatsapp: string | undefined
  isExpired: boolean | undefined
  isOnBehalf: boolean | undefined
  similar: CarPostListItem[] | undefined
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
  gearbox?: string
  firstOwner?: boolean
  exchange?: boolean
  leasing?: boolean
  fcr?: boolean
  q?: string
  /** Lift the 4-month freshness window applied to relevance (text) searches. */
  broaden?: boolean
  includeHidden?: boolean
  authKey?: string
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
  if (filters.isShop !== undefined) qp += `&isShop=${filters.isShop}`
  if (filters.isAuto) qp += '&isAuto=true'
  if (filters.gearbox) qp += `&gearbox=${filters.gearbox}`
  if (filters.firstOwner) qp += '&firstOwner=true'
  if (filters.exchange) qp += '&exchange=true'
  if (filters.leasing) qp += '&leasing=true'
  if (filters.fcr) qp += '&fcr=true'
  if (filters.q) qp += `&q=${filters.q}`
  if (filters.broaden) qp += '&broaden=true'
  if (filters.includeHidden) qp += '&includeHidden=true'
  if (filters.authKey) qp += `&authKey=${encodeURIComponent(filters.authKey)}`

  return qp
}

export async function getCarPosts(
  filters: GetCarPostsFilters,
  cacheInSeconds = 60
): Promise<CarPostListItem[]> {
  try {
    const url = 'car-posts/' + generateCarPostsQueryParams(filters)
    const { content } = await apiGet<CarPostListItem[]>(url, cacheInSeconds)
    return content
  } catch (e) {
    console.error('GET car posts error')
    throw e
  }
}

export interface CarPriceEstimate {
  enough: boolean
  sampleSize: number
  low?: number
  mid?: number
  high?: number
}

export async function estimateCarPrice(params: {
  make: string
  model: string
  year: number
  km: number
  cv: number
  fuel?: string
  gearbox?: string
  firstOwner?: boolean
  fullOptions?: boolean
  specialVersion?: boolean
}): Promise<CarPriceEstimate> {
  const qs = new URLSearchParams({
    make: params.make,
    model: params.model,
    year: String(params.year),
    km: String(params.km),
    cv: String(params.cv)
  })
  if (params.fuel) qs.set('fuel', params.fuel)
  if (params.gearbox) qs.set('gearbox', params.gearbox)
  if (params.firstOwner) qs.set('firstOwner', 'true')
  if (params.fullOptions) qs.set('fullOptions', 'true')
  if (params.specialVersion) qs.set('specialVersion', 'true')
  const { content } = await apiGet<CarPriceEstimate>(
    `car-posts/estimate?${qs.toString()}`,
    60
  )
  return content
}

export async function getFeaturedCarPosts(): Promise<CarPostListItem[]> {
  try {
    const url = 'car-posts/featured'
    const { content } = await apiGet<CarPostListItem[]>(url, 120)
    return content
  } catch (e) {
    console.error('GET featured car posts error')
    throw e
  }
}

export async function getSimilarCarPosts(
  id: string
): Promise<CarPostListItem[]> {
  try {
    const { content } = await apiGet<CarPostListItem[]>(
      `car-posts/${id}/similar`,
      300
    )
    return content
  } catch (e) {
    // A missing "similar cars" block must never break the listing page.
    console.error('GET similar car posts error')
    return []
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
  model?: string,
  cylinder?: string,
  title?: string,
  gearbox?: string,
  fuel?: string,
  isFeatured?: string,
  isExpired?: string,
  isHidden?: string,
  clearPrice?: string,
  cv?: number,
  description?: string,
  phone?: number
): Promise<void> {
  try {
    await apiPatch(`car-posts/${id}`, {
      authKey,
      km,
      year,
      price,
      estimation,
      make,
      model,
      cylinder,
      title,
      gearbox,
      fuel,
      isFeatured,
      isExpired,
      isHidden,
      clearPrice,
      cv,
      description,
      phone
    })
  } catch (e) {
    console.error('PATCH car post error')
    throw e
  }
}

export async function deleteCarPost(
  id: string,
  authKey: string
): Promise<void> {
  try {
    await apiDelete(`car-posts/${id}`, { authKey })
  } catch (e) {
    console.error('DELETE car post error')
    throw e
  }
}

export async function createCarPost(formData: FormData): Promise<unknown> {
  try {
    return await apiPostFormData('car-posts', formData)
  } catch (e) {
    console.error('POST car post error')
    throw e
  }
}

export async function syncFacebook(authKey: string): Promise<void> {
  await apiPost('car-posts/sync-facebook', { authKey })
}

export async function updateCarPostImages(
  id: string,
  formData: FormData
): Promise<unknown> {
  try {
    return await apiPatchFormData(`car-posts/${id}/images`, formData)
  } catch (e) {
    console.error('PATCH car post images error')
    throw e
  }
}
