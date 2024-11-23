import { Metadata } from 'next'
import {
  CarPostListItem,
  getCarPosts
} from '../../api/services/car-posts.service'
import { getMerchant } from '../../api/services/merchants.service'
import CarPostsFeed from '../_components/car-posts/CarPosts'
import ShopHeader from '../_components/ShopHeader'
import { fromQueryParamsToGetCarPostsFilters } from '../helpers'
import MerchantHeader from '../_components/MerchantHeader'

export async function generateMetadata({
  params
}: {
  params: { merchantId?: string }
}): Promise<Metadata> {
  return {
    alternates: {
      canonical: params.merchantId
        ? `https://autocentral.tn/${params.merchantId}`
        : 'https://autocentral.tn'
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
  }
  return (
    <>
      {!merchant && (
        <div className='text-black mx-auto w-full flex flex-col items-center justify-around text-xl lg:text-2xl mt-36'>
          <img src='/lost.svg' alt='Non trouvé(e)' className='max-h-96' />
          <p>Non trouvé(e)</p>
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
