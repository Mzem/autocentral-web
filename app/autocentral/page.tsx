import type { Metadata } from 'next'
import Link from 'next/link'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowRight,
  faArrowsRotate,
  faChartLine,
  faGavel,
  faLayerGroup,
  faMagnifyingGlass,
  faStore
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  CarPostListItem,
  getCarPosts
} from '../../api/services/car-posts.service'
import { MerchantListItem } from '../../api/services/merchants.service'
import CarPostCard from '../_components/car-posts/CarPostCard'
import { AC_URL } from '../_lib/site'

// Same page for every visitor: render once, refresh every 5 minutes.
export const revalidate = 300

export const metadata: Metadata = {
  alternates: { canonical: AC_URL }
}

// Sellers showcased on the home, each with its latest listings.
const FEATURED_MERCHANT_IDS = ['best-auto']
const FEATURED_POSTS = 6

// Where the listings come from (text only - the home deliberately has no image).
const SOURCES = [
  'Tayara',
  'Automobile.tn',
  'Facebook',
  'Instagram',
  'Showrooms'
]

const CONCEPT: { icon: IconDefinition; title: string; text: string }[] = [
  {
    icon: faLayerGroup,
    title: 'Des annonces de partout',
    text: 'Particuliers et professionnels, toutes sources confondues, réunis dans une seule liste.'
  },
  {
    icon: faChartLine,
    title: 'Le juste prix',
    text: 'Chaque annonce est située par rapport au marché, et vous pouvez estimer votre véhicule.'
  },
  {
    icon: faGavel,
    title: 'Enchères publiques',
    text: 'Les véhicules vendus aux enchères par la Douane et au JORT, fiche décodée depuis le VIN.'
  },
  {
    icon: faArrowsRotate,
    title: 'Mis à jour en continu',
    text: 'Les nouvelles annonces arrivent toute la journée, sans rien avoir à surveiller.'
  }
]

type FeaturedSeller = { merchant: MerchantListItem; posts: CarPostListItem[] }

// `publishedAt` is a "DD/MM/YYYY" (fr) string.
const publishedTime = (post: CarPostListItem): number => {
  const [d, m, y] = (post.publishedAt || '').split('/').map(Number)
  return d && m && y ? new Date(y, m - 1, d).getTime() : 0
}

async function getFeaturedSellers(): Promise<FeaturedSeller[]> {
  const sellers: FeaturedSeller[] = []
  for (const merchantId of FEATURED_MERCHANT_IDS) {
    try {
      const posts = await getCarPosts({ page: 1, merchantId }, revalidate)
      const latest = posts
        .filter((p) => !p.isExpired && p.image)
        // Newest first (stable: same-day listings keep the API order).
        .sort((a, b) => publishedTime(b) - publishedTime(a))
        .slice(0, FEATURED_POSTS)
      if (latest.length > 0) {
        sellers.push({ merchant: latest[0].merchant, posts: latest })
      }
    } catch {
      // API unreachable: the home still renders, without this seller.
    }
  }
  return sellers
}

export default async function AutocentralHome() {
  const sellers = await getFeaturedSellers()

  return (
    <>
      {/* ───────── Le concept (sans image : dégradés CSS uniquement) ───────── */}
      <section className='relative overflow-hidden bg-black'>
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_0%,rgba(0,129,227,0.30),transparent_70%)]'
        />
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]'
        />
        <div
          aria-hidden='true'
          className='pointer-events-none absolute -right-28 top-1/3 h-80 w-80 rounded-full bg-brand-500/15 blur-3xl'
        />

        <div className='relative z-10 mx-auto w-[92%] pb-12 pt-24 xl:max-w-6xl lg:pb-20 lg:pt-32'>
          <p className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/80 backdrop-blur'>
            <FontAwesomeIcon
              icon={faLayerGroup}
              className='h-3.5 w-3.5 text-brand-400'
            />
            Toutes les annonces auto
          </p>

          <h1 className='mt-5 max-w-4xl text-balance text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-6xl'>
            Les voitures d&apos;occasion de toute la Tunisie,{' '}
            <span className='text-brand-500'>au même endroit.</span>
          </h1>

          <p className='mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/75 lg:text-lg'>
            Autocentral rassemble les annonces publiées un peu partout - sites
            d&apos;annonces, pages Facebook et Instagram des vendeurs, showrooms
            - dans un seul moteur de recherche. Vous cherchez une fois, vous
            comparez tout.
          </p>

          <ul className='mt-6 flex flex-wrap gap-2' aria-label='Sources'>
            {SOURCES.map((source) => (
              <li
                key={source}
                className='list-none rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80'
              >
                {source}
              </li>
            ))}
          </ul>

          {/* En mobile : titre seul (icône inline), le détail à partir de md */}
          <div className='mt-8 grid grid-cols-1 gap-1.5 sm:grid-cols-2 md:gap-3 lg:mt-12 lg:grid-cols-4'>
            {CONCEPT.map((item) => (
              <div
                key={item.title}
                className='rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10 backdrop-blur-sm md:px-4 md:py-4'
              >
                <h2 className='flex items-center gap-2 text-xs font-semibold text-white md:text-sm'>
                  <FontAwesomeIcon
                    icon={item.icon}
                    className='h-3.5 w-3.5 shrink-0 text-brand-400 md:h-4 md:w-4'
                  />
                  {item.title}
                </h2>
                <p className='mt-2 hidden text-xs leading-relaxed text-white/70 md:block'>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Vendeurs en vedette (fond blanc) ───────── */}
      <section className='bg-white text-ink-950'>
        <div className='mx-auto w-[92%] py-10 xl:max-w-6xl lg:py-16'>
          <p className='inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-500'>
            <FontAwesomeIcon icon={faStore} className='h-4 w-4' />
            Vendeurs en vedette
          </p>
          <h2 className='mt-3 text-2xl font-extrabold tracking-tight lg:text-4xl'>
            Leurs dernières annonces
          </h2>

          {sellers.length === 0 ? (
            <p className='mt-8 rounded-2xl bg-ink-50 px-6 py-12 text-center text-sm text-ink-500'>
              Les annonces en vedette arrivent très bientôt.
            </p>
          ) : (
            sellers.map(({ merchant, posts }) => (
              <div key={merchant.id} className='mt-8'>
                <div className='flex items-center gap-3'>
                  {merchant.avatar ? (
                    <img
                      src={merchant.avatar}
                      alt={merchant.name}
                      loading='lazy'
                      className='h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-ink-100'
                    />
                  ) : (
                    <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500'>
                      <FontAwesomeIcon icon={faStore} className='h-5 w-5' />
                    </span>
                  )}
                  <div className='min-w-0'>
                    <h3 className='truncate text-lg font-bold leading-tight'>
                      {merchant.name}
                    </h3>
                    <p className='text-xs text-ink-500'>
                      {posts.length > 1
                        ? `Ses ${posts.length} dernières annonces`
                        : 'Sa dernière annonce'}
                    </p>
                  </div>
                </div>

                <ul className='mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {posts.map((post) => (
                    <CarPostCard key={post.id} post={post} />
                  ))}
                </ul>
              </div>
            ))
          )}

          {/* Fin de page : accès au moteur de recherche */}
          <div className='mt-12 flex justify-center lg:mt-16'>
            <Link
              href='/annonces'
              className='inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600'
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className='h-4 w-4' />
              Voir le moteur de recherche
              <FontAwesomeIcon icon={faArrowRight} className='h-3.5 w-3.5' />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
