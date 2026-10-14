import { Metadata } from 'next'
import {
  CarPostListItem,
  getCarPosts
} from '../../api/services/car-posts.service'
import { getMerchant } from '../../api/services/merchants.service'
import CarPostsFeed from '../_components/car-posts/CarPosts'
import MerchantHeader from '../_components/MerchantHeader'
import { fromQueryParamsToGetCarPostsFilters } from '../helpers'
import { notFound } from 'next/navigation'
import { AC_URL } from '../_lib/site'

// A real merchant slug is lowercase alphanumerics + hyphens (e.g. "tunisian-cars").
// Anything else is an asset request (favicon.ico, race_flag.svg) or a bot probe
// (wp-login.php, 67.php): skip the API round-trip that would only 404-spam.
const isMerchantSlug = (s?: string): boolean =>
  !!s && /^[a-z0-9-]{1,60}$/.test(s)

/**
 * Metadata of a seller page (`/[merchantId]`), served on both sites. Its
 * canonical URL is always autocentral.tn (the listings site), so search
 * engines index a single version.
 */
export async function merchantMetadata(
  merchantId: string | undefined
): Promise<Metadata> {
  const merchant =
    merchantId && isMerchantSlug(merchantId)
      ? await getMerchant(merchantId)
      : null
  const url = merchantId ? `${AC_URL}/${merchantId}` : AC_URL

  if (!merchant) {
    return {
      description: 'Vendeur occasion en Tunisie',
      alternates: { canonical: url }
    }
  }
  const title = `${merchant.name} - voitures d'occasion${
    merchant.regionName ? ` à ${merchant.regionName}` : ''
  } | Autocentral`
  const description = `Toutes les annonces de voitures d'occasion de ${
    merchant.name
  }${merchant.regionName ? ` (${merchant.regionName})` : ''} sur Autocentral.`
  const images = [merchant.avatar || '/autocentral/logo_rect.jpg']
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'Autocentral',
      images
    },
    twitter: { card: 'summary', title, description, images }
  }
}

/** Seller page body, shared by both sites (the route files are thin wrappers). */
export default async function MerchantView({
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
  // Unknown seller: a real 404 (not an empty 200 page search engines index).
  if (!merchant) notFound()

  return (
    <>
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
