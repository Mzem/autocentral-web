import type { Metadata } from 'next'
import { getCarPosts } from '../api/services/car-posts.service'
import CarPostsFeed from './_components/car-posts/CarPosts'
import { fromQueryParamsToGetCarPostsFilters } from './helpers'

export async function generateMetadata({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>
}): Promise<Metadata> {
  const q = typeof searchParams.q === 'string' ? searchParams.q : ''
  const canonicalUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL
  }/?q=${encodeURIComponent(q)}`

  return {
    title: "Voitures d'occasion en Tunisie",
    alternates: {
      canonical: canonicalUrl
    }
  }
}

export default async function Home({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const filters = fromQueryParamsToGetCarPostsFilters(searchParams)
  const posts = await getCarPosts(filters)

  return (
    <>
      <div className='text-center text-base lg:text-2xl mt-10 lg:mt-24 text-black mb-8 lg:mb-16 '>
        <p className='mx-2'>
          Découvrez le premier moteur de recherche
          <br />
          de véhicules d'occasion en{' '}
          <span className='font-semibold text-vividred'>Tunisie</span>
        </p>
        <p className='mt-1'>
          <span className='font-semibold text-vividred'>+100 </span>
          nouvelles annonces par jour
        </p>
      </div>
      <CarPostsFeed initialPosts={posts} initialFilters={filters} />
    </>
  )
}
