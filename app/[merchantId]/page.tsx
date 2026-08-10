import { Metadata } from 'next'
import {
  CarPostListItem,
  getCarPosts
} from '../../api/services/car-posts.service'
import { getMerchant } from '../../api/services/merchants.service'
import CarPostsFeed from '../_components/car-posts/CarPosts'
import MerchantHeader from '../_components/MerchantHeader'
import { fromQueryParamsToGetCarPostsFilters } from '../helpers'
import Link from 'next/link'

export async function generateMetadata({
  params
}: {
  params: { merchantId?: string }
}): Promise<Metadata> {
  const merchant = params.merchantId
    ? await getMerchant(params.merchantId)
    : null

  if (merchant) {
    return {
      alternates: {
        canonical: params.merchantId
          ? `https://tunisiancars.com.tn/${params.merchantId}`
          : 'https://tunisiancars.com.tn'
      },
      description: merchant.name,
      openGraph: {
        type: 'website',
        url: params.merchantId
          ? `https://tunisiancars.com.tn/${params.merchantId}`
          : 'https://tunisiancars.com.tn',
        title: merchant.name,
        siteName: merchant.name,
        images: merchant.avatar || '/logo_rect.jpg'
      }
    }
  }
  return {
    description: 'Vendeur occasion en Tunisie',
    alternates: {
      canonical: params.merchantId
        ? `https://tunisiancars.com.tn/${params.merchantId}`
        : 'https://tunisiancars.com.tn'
    }
  }
}

export default async function MerchantPage({
  searchParams,
  params
}: {
  searchParams: Record<string, string | string[] | undefined>
  params: { merchantId: string }
}) {
  const merchant = await getMerchant(params.merchantId)
  let posts: CarPostListItem[] = []
  let filters
  if (merchant) {
    filters = fromQueryParamsToGetCarPostsFilters(searchParams)
    filters.merchantId = merchant.id
    posts = await getCarPosts(filters)
    // Only the last 30 days on the seller's page (the rest stays browsable in
    // the global search engine). publishedAt is the "DD/MM/YYYY" (fr) string.
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
    posts = posts.filter((post) => {
      const [d, m, y] = (post.publishedAt || '').split('/').map(Number)
      if (!d || !m || !y) return true
      return new Date(y, m - 1, d).getTime() >= cutoff
    })
  }
  return (
    <>
      {!merchant && (
        <div className='text-white mx-auto w-full flex flex-col items-center justify-around text-xl lg:text-2xl mt-[6rem]'>
          <img src='/lost.svg' alt='Non trouvé(e)' className='max-h-96' />
          <p>Non trouvé(e)</p>
          <Link
            href='/'
            className='bg-ink-950 shadow px-8 rounded-xl mt-6 text-white italic text-base'
          >
            <img src='/logo.svg' alt='' className='h-20' />
          </Link>
          <span className='text-white/55 italic text-sm mt-4'>
            Rechercher une voiture d'occasion
          </span>
        </div>
      )}

      {merchant && (
        <>
          <MerchantHeader merchant={merchant} />
          <div className='mb-8' />
          <CarPostsFeed initialPosts={posts} initialFilters={filters} />
        </>
      )}
    </>
  )
}
