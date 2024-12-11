import type { Metadata } from 'next'
import {
  getCarPosts,
  getFeaturedCarPosts
} from '../api/services/car-posts.service'
import CarPostsFeed from './_components/car-posts/CarPosts'
import { fromQueryParamsToGetCarPostsFilters } from './helpers'
import { DateTime } from 'luxon'

function getDailyCount(): number {
  const now = DateTime.local({ zone: 'UTC+1' }).toJSDate()
  const hours = now.getHours()
  const minutes = now.getMinutes()

  // Calculate the progress of the day as a fraction (0 at midnight, 1 at 23:59)
  const dayProgress = (hours * 60 + minutes) / (24 * 60)
  let max = 30
  if (hours >= 8) max = 50
  if (hours >= 10) max = 300
  if (hours >= 17) max = 500

  // Return a number between 0 and max based on the progress of the day
  return Math.floor(dayProgress * max)
}

export async function generateMetadata({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>
}): Promise<Metadata> {
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined

  return {
    alternates: {
      canonical:
        'https://autocentral.tn' + (q ? `/?q=${encodeURIComponent(q)}` : '')
    }
  }
}

export default async function Home({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const filters = fromQueryParamsToGetCarPostsFilters(searchParams)
  console.debug()
  const posts = await getCarPosts(filters)
  const featuredPosts =
    JSON.stringify(searchParams) === '{}'
      ? await getFeaturedCarPosts()
      : undefined

  return (
    <>
      <div className='text-center xs:text-sm text-base lg:text-2xl mt-7 lg:mt-20 text-black mb-3 lg:mb-10'>
        <p className='mx-2'>
          1er moteur de recherche <br className='lg:hidden' />
          de voitures d'occasion en{' '}
          <span className='font-semibold text-vividred'>Tunisie</span>
        </p>
        <p className='mt-4 lg:mt-6'>
          <span className='font-semibold text-vividred'>
            +{getDailyCount()}{' '}
          </span>
          nouvelles annonces aujourd'hui
        </p>
        {/* <div className='w-[20%] md:w-[5%] mx-auto justify-around flex items-center space-x-1 text-[0.7rem]'>
          <img src='/tayara.jpg' alt='tayara.tn' className='h-4 rounded-full' />
          <img
            src='/automobiletn.png'
            alt='automobile.tn'
            className='h-4 rounded-full'
          />
          <img
            src='/facebook.svg'
            alt='facebook.com'
            className='h-4 rounded-full'
          />
          <img
            src='/instagram.svg'
            alt='instagram.com'
            className='h-4 rounded-full'
          />
        </div> */}
        <p className='text-[0.6rem] lg:text-sm lg:mt-4 italic text-black text-opacity-55'>
          Site web non-commercial 100% gratuit
        </p>
      </div>
      <CarPostsFeed
        initialPosts={posts}
        featuredPosts={featuredPosts}
        initialFilters={filters}
      />
    </>
  )
}
