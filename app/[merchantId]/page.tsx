import { Metadata } from 'next'
import { getCarPosts } from '../../api/services/car-posts.service'
import { getMerchant } from '../../api/services/merchants.service'
import CarPostsFeed from '../_components/car-posts/CarPosts'
import ShopHeader from '../_components/ShopHeader'
import { fromQueryParamsToGetCarPostsFilters } from '../helpers'

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
  const filters = fromQueryParamsToGetCarPostsFilters(searchParams)
  filters.merchantId = merchant.id
  const posts = await getCarPosts(filters)

  return (
    <>
      <ShopHeader
        id={merchant.id}
        name={merchant.name}
        phone={merchant.phone}
        location={merchant.gmapsLink}
        fb={merchant.fb}
        insta={merchant.insta}
        avatar={merchant.avatar}
      />
      <div className='mb-8' />
      <CarPostsFeed initialPosts={posts} initialFilters={filters} />
    </>
  )
}
