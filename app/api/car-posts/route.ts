import { NextRequest } from 'next/server'
import {
  getCarPosts,
  GetCarPostsFilters
} from '../../../api/services/car-posts.service'

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

export async function GET(req: NextRequest) {
  const filters = fromQueryParamsToGetCarPostsFilters(
    undefined,
    req.nextUrl.searchParams
  )
  const posts = await getCarPosts(filters)
  return Response.json(posts)
}
