import { Metadata } from 'next'
import {
  getCarPosts,
  CarPostListItem
} from '../../api/services/car-posts.service'
import { fromQueryParamsToGetCarPostsFilters } from '../helpers'
import CarPostsFeed from '../_components/car-posts/CarPosts'

// Search + results depend on the query string, so always render per request.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Annonces — Tunisian Cars',
  description: "Recherchez parmi toutes les annonces de voitures d'occasion.",
  alternates: { canonical: 'https://tunisiancars.com.tn/annonces' }
}

export default async function AnnoncesPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const filters = fromQueryParamsToGetCarPostsFilters(searchParams)

  let initialPosts: CarPostListItem[] = []
  try {
    initialPosts = await getCarPosts(filters)
  } catch {
    initialPosts = []
  }

  return <CarPostsFeed initialPosts={initialPosts} initialFilters={filters} />
}
