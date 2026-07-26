import { DateTime } from 'luxon'
import type { Metadata } from 'next'
import {
  getCarPosts,
  getFeaturedCarPosts
} from '../api/services/car-posts.service'
import CarPostsFeed from './_components/car-posts/CarPosts'
import { fromQueryParamsToGetCarPostsFilters } from './helpers'

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
  const posts = await getCarPosts(filters)
  const featuredPosts =
    JSON.stringify(searchParams) === '{}' ||
    !JSON.stringify(searchParams).includes('page')
      ? await getFeaturedCarPosts()
      : undefined

  const isTransactionOK = searchParams.transaction === 'ok'
  const isTransactionKO = searchParams.transaction === 'ko'

  return (
    <>
      {isTransactionOK && (
        <div className='rounded-xl bg-success/10 ring-1 ring-success/30 font-semibold text-success text-center py-3 px-4 mb-4'>
          🎉 Votre paiement est validé ! Nous allons mettre en avant votre
          annonce sur le site et la partager sur nos réseaux sociaux.
        </div>
      )}
      {isTransactionKO && (
        <div className='rounded-xl bg-danger/10 ring-1 ring-danger/30 font-semibold text-danger text-center py-3 px-4 mb-4'>
          ❌ Votre paiement a échoué ! Veuillez réessayer ou prendre contact
          avec notre équipe.
        </div>
      )}
      <div className='text-center mt-4 lg:mt-10 mb-5 lg:mb-8'>
        <h1 className='text-balance text-xl sm:text-2xl lg:text-4xl font-extrabold text-white leading-tight'>
          1<sup className='text-[0.6em] font-bold'>er</sup> moteur de recherche{' '}
          <br className='lg:hidden' />
          de voitures d&apos;occasion en{' '}
          <span className='text-brand-600'>Tunisie</span>
        </h1>
        <p className='mt-3 lg:mt-4 inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-xs lg:text-sm text-ink-400 shadow-card ring-1 ring-white/10'>
          <span
            aria-hidden='true'
            className='h-2 w-2 rounded-full bg-success'
          />
          <span>
            <span className='font-bold text-white'>+{getDailyCount()}</span>{' '}
            nouvelles annonces aujourd&apos;hui
          </span>
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
        {/* <div className='text-xs lg:text-sm mt-2 lg:mt-4 text-white text-opacity-55'>
          <p className='mb-[0.1rem] italic'>
            Ce service gratuit me coute du temps et de l'argent
          </p>
          <a
            href='https://gateway.konnect.network/me/malekautocentral'
            target='_blank'
            className='rounded-lg px-[8px] py-[2px] text-white shadow-md shadow-black/40  hover:bg-whiteoapc2 bg-surface hover:bg-brand-50 font-semibold flex items-center justify-center space-x-1 max-w-[230px] lg:max-w-[300px] mx-auto'
          >
            <img src='/hand.svg' className='h-4' alt='Don' />
            <span>Faire un don pour me soutenir</span>
          </a>
        </div> */}
      </div>

      <CarPostsFeed
        initialPosts={posts}
        featuredPosts={featuredPosts}
        initialFilters={filters}
      />
    </>
  )
}
