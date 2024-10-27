import {
  getCarPosts,
  GetCarPostsFilters
} from '../api/services/car-posts.service'
import CarPostsFeed from './_components/car-posts/CarPosts'
import Head from 'next/head'
import { fromQueryParamsToGetCarPostsFilters } from './api/car-posts/route'

export default async function Home({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const q = typeof searchParams.q === 'string' ? searchParams.q : ''
  const filters = fromQueryParamsToGetCarPostsFilters(searchParams)
  const posts = await getCarPosts(filters)
  const canonicalUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL
  }/?q=${encodeURIComponent(q)}`

  return (
    <>
      <Head>
        <link rel='canonical' href={canonicalUrl} />
      </Head>

      <div className='text-center text-base lg:text-2xl mt-10 lg:mt-24 text-black mb-8 lg:mb-16 '>
        <p className='mx-2'>
          Découvrez le premier moteur de recherche de véhicules d'occasion en{' '}
          <span className='font-semibold text-vividred'>Tunisie</span>
        </p>
        <p className='mt-1'>
          <span className='font-semibold text-vividred'>+100 </span>
          nouvelles annonces par jour
        </p>
      </div>
      <CarPostsFeed
        withFixed={true}
        initialPosts={posts}
        initialFilters={filters}
      />
    </>
  )
}
