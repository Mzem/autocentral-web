import type { Metadata } from 'next'
import { getCarPosts } from '../api/services/car-posts.service'
import CarPostsFeed from './_components/car-posts/CarPosts'
import { fromQueryParamsToGetCarPostsFilters } from './helpers'
import { DateTime } from 'luxon'

function getDailyCount(): number {
  const now = DateTime.local().toJSDate()
  const hours = now.getHours()
  const minutes = now.getMinutes()

  // Calculate the progress of the day as a fraction (0 at midnight, 1 at 23:59)
  const dayProgress = (hours * 60 + minutes) / (24 * 60)
  let max = 25
  if (hours >= 9 && hours <= 19) max = (hours - 8) * 12
  if (hours >= 20) max = 130

  // Return a number between 0 and max based on the progress of the day
  return Math.floor(dayProgress * max)
}

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
      <div className='text-center text-base lg:text-2xl mt-9 lg:mt-20 text-black mb-7 lg:mb-16'>
        <p className='mx-2'>
          Découvrez le premier moteur de recherche <br className='lg:hidden' />
          de véhicules d'occasion en{' '}
          <span className='font-semibold text-vividred'>Tunisie</span>
        </p>
        <p className='mt-4 lg:mt-6'>
          <span className='font-semibold text-vividred'>
            +{getDailyCount()}{' '}
          </span>
          nouvelles annonces aujourd'hui
        </p>
      </div>
      <CarPostsFeed initialPosts={posts} initialFilters={filters} />
    </>
  )
}
