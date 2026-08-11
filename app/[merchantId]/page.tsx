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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCarBurst } from '@fortawesome/free-solid-svg-icons'

// A real merchant slug is lowercase alphanumerics + hyphens (e.g. "tunisian-cars").
// Anything else is an asset request (favicon.ico, race_flag.svg) or a bot probe
// (wp-login.php, 67.php): skip the API round-trip that would only 404-spam.
const isMerchantSlug = (s?: string): boolean =>
  !!s && /^[a-z0-9-]{1,60}$/.test(s)

export async function generateMetadata({
  params
}: {
  params: { merchantId?: string }
}): Promise<Metadata> {
  const merchant =
    params.merchantId && isMerchantSlug(params.merchantId)
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
  const merchant = isMerchantSlug(params.merchantId)
    ? await getMerchant(params.merchantId)
    : null
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
          <FontAwesomeIcon
            icon={faCarBurst}
            aria-hidden='true'
            className='h-40 text-white/25'
          />
          <p className='mt-6'>Non trouvé(e)</p>
          <Link
            href='/'
            className='bg-ink-950 shadow px-8 py-3 rounded-xl mt-6 text-white italic text-base'
          >
            <img
              src='/tunisiancars/logo_rect.png'
              alt='Tunisian Cars'
              className='h-16'
            />
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
