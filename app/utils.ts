import { GetCarPostsFilters } from '../api/services/car-posts.service'

export const regionsSelect = [
  {
    value: 'ariana',
    label: 'Ariana'
  },
  {
    value: 'ben-arous',
    label: 'Ben Arous'
  },
  {
    value: 'bizerte',
    label: 'Bizerte'
  },
  {
    value: 'beja',
    label: 'Béja'
  },
  {
    value: 'gabes',
    label: 'Gabès'
  },
  {
    value: 'gafsa',
    label: 'Gafsa'
  },
  {
    value: 'jendouba',
    label: 'Jendouba'
  },
  {
    value: 'kairouan',
    label: 'Kairouan'
  },
  {
    value: 'kasserine',
    label: 'Kasserine'
  },
  {
    value: 'kebili',
    label: 'Kébili'
  },
  {
    value: 'la-manouba',
    label: 'La Manouba'
  },
  {
    value: 'le-kef',
    label: 'Le Kef'
  },
  {
    value: 'mahdia',
    label: 'Mahdia'
  },
  {
    value: 'medenine',
    label: 'Médenine'
  },
  {
    value: 'monastir',
    label: 'Monastir'
  },
  {
    value: 'nabeul',
    label: 'Nabeul'
  },
  {
    value: 'sfax',
    label: 'Sfax'
  },
  {
    value: 'sidi-bouzid',
    label: 'Sidi Bouzid'
  },
  {
    value: 'siliana',
    label: 'Siliana'
  },
  {
    value: 'sousse',
    label: 'Sousse'
  },
  {
    value: 'tataouine',
    label: 'Tataouine'
  },
  {
    value: 'tozeur',
    label: 'Tozeur'
  },
  {
    value: 'tunis',
    label: 'Tunis'
  },
  {
    value: 'zaghouan',
    label: 'Zaghouan'
  }
]

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
  searchParamsRecord?: Record<string, string | string[] | undefined>,
  searchParamsURL?: URLSearchParams
): GetCarPostsFilters {
  return {
    page: Number(searchParamsRecord?.page ?? searchParamsURL?.get('page')) || 1,
    q:
      searchParamsRecord?.q && typeof searchParamsRecord.q === 'string'
        ? searchParamsRecord.q
        : searchParamsURL?.get('q') || '',
    isShop:
      searchParamsRecord?.isShop === 'true' ||
      searchParamsURL?.get('isShop') === 'true',
    isAuto:
      searchParamsRecord?.isAuto === 'true' ||
      searchParamsURL?.get('isAuto') === 'true',
    firstOwner:
      searchParamsRecord?.firstOwner === 'true' ||
      searchParamsURL?.get('firstOwner') === 'true',
    exchange:
      searchParamsRecord?.exchange === 'true' ||
      searchParamsURL?.get('exchange') === 'true',
    leasing:
      searchParamsRecord?.exchange === 'true' ||
      searchParamsURL?.get('exchange') === 'true'
  }
}
