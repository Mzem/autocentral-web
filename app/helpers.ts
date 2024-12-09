import { GetCarPostsFilters } from '../api/services/car-posts.service'
import { Color, Fuel, InteriorType } from './types'

export function sortByStringField<T extends Record<string, any>>(
  array: Array<T>,
  fieldName: string,
  order = 'asc'
): Array<T> {
  return array.sort((a, b) => {
    const fieldA =
      a[fieldName] && typeof a[fieldName] === 'string'
        ? a[fieldName].toLowerCase()
        : undefined
    const fieldB =
      b[fieldName] && typeof b[fieldName] === 'string'
        ? b[fieldName].toLowerCase()
        : undefined

    if (!fieldA && !fieldB) return 0
    if (!fieldA) {
      return 1
    }
    if (!fieldB) {
      return -1
    }

    if (fieldA < fieldB) {
      return order === 'asc' ? -1 : 1
    }
    if (fieldA > fieldB) {
      return order === 'asc' ? 1 : -1
    }
    return 0
  })
}

export function fromQueryParamsToGetCarPostsFilters(
  searchParamsRecord?: Record<string, string | string[] | number | undefined>,
  searchParamsURL?: URLSearchParams
): GetCarPostsFilters {
  function getParamValueString(key: string): string | undefined {
    return searchParamsRecord?.[key] &&
      typeof searchParamsRecord[key] === 'string'
      ? searchParamsRecord[key]
      : searchParamsURL?.get(key) || undefined
  }
  function getParamValueNumber(key: string): number | undefined {
    return (
      Number(searchParamsRecord?.[key] ?? searchParamsURL?.get(key)) ||
      undefined
    )
  }
  function getParamValueStringArray(key: string): string[] {
    return searchParamsRecord?.[key] && Array.isArray(searchParamsRecord[key])
      ? searchParamsRecord[key]
      : searchParamsURL?.getAll(key) ||
          [getParamValueString(key)]
            .filter((e) => e !== undefined)
            .filter((e) => e)
  }
  function getParamValueBoolean(key: string): boolean {
    return (
      searchParamsRecord?.[key] === 'true' ||
      searchParamsURL?.get(key) === 'true'
    )
  }
  return {
    page: Number(searchParamsRecord?.page ?? searchParamsURL?.get('page')) || 1,
    merchantId: getParamValueString('merchantId'),
    make: getParamValueString('make'),
    model: getParamValueString('model'),
    regionIds: getParamValueStringArray('regionIds'),
    fuel: getParamValueStringArray('fuel') as Fuel[],
    color: getParamValueStringArray('color') as Color[],
    interiorType: getParamValueStringArray('interiorType') as InteriorType[],
    maxPrice: getParamValueNumber('maxPrice'),
    minPrice: getParamValueNumber('minPrice'),
    maxKm: getParamValueNumber('maxKm'),
    minKm: getParamValueNumber('minKm'),
    maxYear: getParamValueNumber('maxYear'),
    minYear: getParamValueNumber('minYear'),
    maxCV: getParamValueNumber('maxCV'),
    minCV: getParamValueNumber('minCV'),
    alarm: getParamValueBoolean('alarm'),
    keyless: getParamValueBoolean('keyless'),
    camera: getParamValueBoolean('camera'),
    isShop: getParamValueBoolean('isShop'),
    isAuto: getParamValueBoolean('isAuto'),
    firstOwner: getParamValueBoolean('firstOwner'),
    exchange: getParamValueBoolean('exchange'),
    leasing: getParamValueBoolean('leasing'),
    fcr: getParamValueBoolean('fcr'),
    q: getParamValueString('q') || ''
  }
}

export function dotNumber(
  nbOrString?: number | null | string
): string | undefined {
  let nb: number | null | undefined
  if (typeof nbOrString === 'string') {
    nb = Number(nbOrString)
  } else {
    nb = nbOrString
  }

  if (nb === 0) return nb.toString()
  if (!nb) return
  if (nb >= 10000) return nb.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return nb.toString()
}

export function fromNameToId(name?: string): string {
  return (
    name
      ?.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
      .replace(/[^\w\s]/g, '') // Remove non alphanumeric
      .replace(/\s+/g, ' ') // Remove multiple whitespaces
      .toLowerCase()
      .trim()
      .replace(/ /g, '-') ?? ''
  )
}
