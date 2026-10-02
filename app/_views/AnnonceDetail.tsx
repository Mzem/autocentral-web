import type { Metadata } from 'next'
import { getCarPost } from '../../api/services/car-posts.service'
import CarPostDetail from '../_components/tunisiancars/CarPostDetail'
import { AC_URL, TC_URL } from '../_lib/site'
import { dotNumber } from '../helpers'
import { fuelLabel } from '../types'

export type Site = 'tc' | 'ac'

const SITE = {
  tc: {
    url: TC_URL,
    name: 'Tunisian Cars',
    image: '/tunisiancars/logo_share.png'
  },
  ac: { url: AC_URL, name: 'Autocentral', image: '/autocentral/logo_rect.jpg' }
} as const

// Reject junk ids (bot probes like xmlrpc.php, stray "null"/"toyota-", path
// chars) before the API call - they only ever produce a wasteful 404.
const isCarPostId = (s?: string): boolean =>
  !!s &&
  s !== 'null' &&
  s !== 'undefined' &&
  !/[./\\]/.test(s) &&
  s.length <= 80

/**
 * Metadata of a listing page. The page exists on both sites; its canonical URL
 * is always autocentral.tn (the Tunisian Cars showroom's cars included), so
 * search engines index a single version, on the listings site.
 */
export async function annonceMetadata(
  id: string | undefined,
  site: Site
): Promise<Metadata> {
  const here = SITE[site]
  const post = id && isCarPostId(id) ? await getCarPost(id) : null
  const url = id ? `${AC_URL}/annonces/${id}` : AC_URL

  if (!post) {
    return {
      description: `Annonce ${here.name}`,
      alternates: { canonical: url }
    }
  }

  const name =
    post.title ||
    [post.make, post.model, post.year].filter(Boolean).join(' ') ||
    "Voiture d'occasion"
  const title = `${name} | ${here.name}`
  const description = [
    name,
    post.price ? `${dotNumber(post.price)} DT` : null,
    post.km != null ? `${dotNumber(post.km)} km` : null,
    post.fuel ? fuelLabel(post.fuel) : null,
    post.gearbox,
    post.region?.name,
    "voiture d'occasion en Tunisie"
  ]
    .filter(Boolean)
    .join(' · ')
  const images = [post.images[0] || here.image]
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: here.name,
      images
    },
    twitter: { card: 'summary_large_image', title, description, images }
  }
}

/**
 * Full listing page (direct visit / refresh). In-app navigation shows the same
 * `CarPostDetail` inside the intercepting-route modal instead.
 */
export default async function AnnonceDetail({ id }: { id: string }) {
  const post = isCarPostId(id) ? await getCarPost(id) : null

  if (!post) {
    return (
      <div className='mt-14 min-h-screen bg-white text-ink-950 lg:mt-16'>
        <div className='mx-auto w-[92%] py-24 text-center text-ink-500 xl:max-w-6xl'>
          Annonce introuvable ou expirée.
        </div>
      </div>
    )
  }

  return (
    <div className='mt-14 min-h-screen bg-white text-ink-950 lg:mt-16'>
      <CarPostDetail post={post} />
    </div>
  )
}
