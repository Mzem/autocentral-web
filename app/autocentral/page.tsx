import type { Metadata } from 'next'
import Link from 'next/link'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowRight,
  faArrowsRotate,
  faChartLine,
  faCircleCheck,
  faGavel,
  faLocationDot,
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
import { AC_URL, FEATURED_MERCHANT_IDS } from '../_lib/site'

// Same page for every visitor: render once, refresh every 5 minutes.
export const revalidate = 300

export const metadata: Metadata = {
  alternates: { canonical: AC_URL }
}

// Latest listings shown for each featured seller (FEATURED_MERCHANT_IDS).
const FEATURED_POSTS = 6

// What the site offers, as title-only tiles (the home has no image).
const HIGHLIGHTS: { icon: IconDefinition; title: string }[] = [
  { icon: faArrowsRotate, title: 'Mise à jour en continu' },
  { icon: faChartLine, title: 'Estimations de prix' },
  { icon: faGavel, title: 'Enchères publiques de la douane' },
  { icon: faCircleCheck, title: '100% gratuit' }
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
      {/* ───────── Le concept : moitié haute de l'écran, sans image ─────────
          Fond = dégradés CSS aux rouges du logo (halo bordeaux + touche de
          rouge vif), gardés à droite / en bas pour laisser le titre sur noir. */}
      <section className='relative flex min-h-[50svh] items-center overflow-hidden bg-black'>
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 bg-[radial-gradient(85%_130%_at_100%_100%,#371211_0%,rgba(55,18,17,0.55)_42%,transparent_72%)]'
        />
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_bottom_right,black_25%,transparent_72%)]'
        />
        <div
          aria-hidden='true'
          className='pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl'
        />

        <div className='relative z-10 mx-auto w-[92%] pb-5 pt-[4.5rem] xl:max-w-6xl lg:pb-7 lg:pt-[5.5rem]'>
          {/* The largest size only on tall screens: on a small laptop the
              block must still fit in half the viewport. */}
          <h1 className='max-w-4xl text-balance text-[1.55rem] font-extrabold leading-[1.1] tracking-tight text-white sm:text-3xl lg:text-4xl xl:[@media(min-height:760px)]:text-5xl'>
            Les voitures d&apos;occasion de toute la Tunisie,{' '}
            <span className='text-brand-500'>au même endroit.</span>
          </h1>

          <p className='mt-3 max-w-3xl text-pretty text-sm leading-relaxed text-white/75 lg:mt-4 lg:text-base'>
            Autocentral centralise les annonces publiées sur les sites
            d&apos;annonces, pages Facebook et Instagram des vendeurs - dans un
            seul moteur de recherche. Vous cherchez une fois, vous comparez
            tout.
          </p>

          {/* 2 x 2 on phones; one row on desktop, each tile sized to its title. */}
          <ul className='mt-4 grid grid-cols-2 gap-1.5 md:gap-3 lg:mt-6 lg:flex'>
            {HIGHLIGHTS.map((item) => (
              <li
                key={item.title}
                className='flex list-none items-center gap-2 rounded-xl bg-white/5 px-2.5 py-2 text-xs font-semibold leading-tight text-white ring-1 ring-white/10 backdrop-blur-sm md:px-4 md:py-3 md:text-sm lg:flex-auto'
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className='h-3.5 w-3.5 shrink-0 text-brand-400 md:h-4 md:w-4'
                />
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── Vendeurs en vedette (fond blanc) ───────── */}
      <section className='bg-white text-ink-950'>
        <div className='mx-auto w-[92%] py-8 xl:max-w-6xl lg:py-12'>
          <h2 className='inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-500'>
            <FontAwesomeIcon icon={faStore} className='h-4 w-4' />
            Vendeurs en vedette
          </h2>

          {sellers.length === 0 ? (
            <p className='mt-6 rounded-2xl bg-ink-50 px-6 py-12 text-center text-sm text-ink-500'>
              Les annonces en vedette arrivent très bientôt.
            </p>
          ) : (
            sellers.map(({ merchant, posts }) => {
              const region = posts.find((p) => p.region?.name)?.region.name
              return (
                <div key={merchant.id} className='mt-5'>
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
                      {region && (
                        <p className='mt-0.5 flex items-center gap-1 text-xs text-ink-500'>
                          <FontAwesomeIcon
                            icon={faLocationDot}
                            className='h-3 w-3'
                          />
                          {region}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Featured sellers' cards carry the region + "Appeler". */}
                  <ul className='mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {posts.map((post) => (
                      <CarPostCard key={post.id} post={post} />
                    ))}
                  </ul>
                </div>
              )
            })
          )}

          {/* Fin de page : accès au moteur de recherche */}
          <div className='mt-12 flex justify-center lg:mt-16'>
            <Link
              href='/annonces'
              className='inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-colors hover:bg-brand-500'
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
