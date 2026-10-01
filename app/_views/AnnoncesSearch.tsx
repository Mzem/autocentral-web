import {
  CarPostListItem,
  getCarPosts
} from '../../api/services/car-posts.service'
import CarPostsFeed from '../_components/car-posts/CarPosts'
import { fromQueryParamsToGetCarPostsFilters } from '../helpers'

export type SearchParams = { [key: string]: string | string[] | undefined }

/**
 * The listings search engine (`/annonces`), shared by both sites: the route
 * file of each site only adds its own metadata. Search + results depend on the
 * query string, so the routes using it render per request (`force-dynamic`).
 */
export default async function AnnoncesSearch({
  searchParams
}: {
  searchParams: SearchParams
}) {
  const filters = fromQueryParamsToGetCarPostsFilters(searchParams)

  let initialPosts: CarPostListItem[] = []
  try {
    initialPosts = await getCarPosts(filters, 0)
  } catch {
    initialPosts = []
  }

  return (
    <div className='min-h-screen w-full bg-white text-ink-950 pb-10'>
      {/* Black strip under the fixed (translucent) header. */}
      <div className='mb-6 h-16 bg-black lg:mb-10' />
      <CarPostsFeed initialPosts={initialPosts} initialFilters={filters} />
    </div>
  )
}
