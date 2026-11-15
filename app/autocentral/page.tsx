import type { Metadata } from 'next'
import Link from 'next/link'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowRight,
  faArrowsRotate,
  faChartLine,
  faCircleCheck,
  faGavel,
  faMagnifyingGlass,
  faStar
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getAuctions } from '../../api/services/auctions.service'
import {
  CarPostListItem,
  getCarPosts
} from '../../api/services/car-posts.service'
import FeaturedPosts from '../_components/autocentral/FeaturedPosts'
import { newestFirst } from '../_lib/featured'
import { FEATURED_MERCHANT_IDS } from '../_lib/site'
import { acPageMetadata } from '../_lib/site-metadata'

// Same page for every visitor: render once, refresh every 5 minutes.
export const revalidate = 300

export const metadata: Metadata = acPageMetadata({
  title: "Voitures d'occasion en Tunisie - toutes les annonces | Autocentral",
  description:
    "Autocentral regroupe les annonces de voitures d'occasion de toute la Tunisie - sites d'annonces, pages Facebook et Instagram des vendeurs - dans un seul moteur de recherche. Estimation de prix et enchères de la douane. 100% gratuit."
})

// The API returns up to 150 listings per page for one merchant, available
// ones first: fetch further pages only while a page is full of available ones.
const MERCHANT_PAGE_SIZE = 150
const MAX_PAGES = 5

// What the site offers, as title-only tiles (the home has no image). The
// auctions tile only while some auction is open (like the menu entry).
const highlights = (
  hasAuctions: boolean
): { icon: IconDefinition; title: string }[] => [
  { icon: faArrowsRotate, title: 'Mise à jour en continu' },
  { icon: faChartLine, title: 'Estimations de prix' },
  ...(hasAuctions ? [{ icon: faGavel, title: 'Enchères de la douane' }] : []),
  { icon: faCircleCheck, title: '100% gratuit' }
]

/** Link to the search engine (= every other seller's listings). */
function OtherSellersLink() {
  return (
    <Link
      href='/annonces'
      className='inline-flex max-w-full items-center gap-2 rounded-full bg-brand-600 px-5 py-3.5 text-center text-sm sm:px-7 font-semibold text-white shadow-lg shadow-brand-600/25 transition-colors hover:bg-brand-500'
    >
      <FontAwesomeIcon icon={faMagnifyingGlass} className='h-4 w-4' />
      Voir les annonces des autres vendeurs
      <FontAwesomeIcon icon={faArrowRight} className='h-3.5 w-3.5' />
    </Link>
  )
}

/** Every listing of one seller that is neither hidden nor sold. */
async function getAvailablePosts(
  merchantId: string
): Promise<CarPostListItem[]> {
  const out: CarPostListItem[] = []
  for (let page = 1; page <= MAX_PAGES; page++) {
    const posts = await getCarPosts({ page, merchantId }, revalidate)
    const available = posts.filter((p) => !p.isExpired && !p.isHidden)
    out.push(...available)
    if (posts.length < MERCHANT_PAGE_SIZE || available.length < posts.length)
      break
  }
  return out
}

/** All the featured sellers' available listings, mixed, newest first. */
async function getFeaturedPosts(): Promise<CarPostListItem[]> {
  const lists = await Promise.all(
    FEATURED_MERCHANT_IDS.map((merchantId) =>
      // API unreachable: the home still renders, without this seller.
      getAvailablePosts(merchantId).catch(() => [] as CarPostListItem[])
    )
  )
  return newestFirst(lists.flat())
}

export default async function AutocentralHome() {
  const [posts, auctions] = await Promise.all([
    getFeaturedPosts(),
    getAuctions(revalidate)
  ])

  return (
    <>
      {/* ───────── Le concept : 40 % de l'écran, sans image ─────────
          Fond = dégradés CSS aux rouges du logo (halo bordeaux + touche de
          rouge vif), gardés à droite / en bas pour laisser le titre sur noir. */}
      <section className='relative flex min-h-[40svh] items-center overflow-hidden bg-black'>
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

        <div className='relative z-10 mx-auto w-[92%] pb-4 pt-[4.25rem] xl:max-w-6xl lg:pb-6 lg:pt-20'>
          {/* The largest size only on tall screens: on a small laptop the
              block must still fit in 40% of the viewport. */}
          <h1 className='max-w-4xl text-balance text-[1.55rem] font-extrabold leading-[1.1] tracking-tight text-white sm:text-3xl lg:text-4xl xl:[@media(min-height:860px)]:text-5xl'>
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
          <ul className='mt-4 grid grid-cols-2 gap-1.5 md:gap-3 lg:mt-5 lg:flex'>
            {highlights(auctions.length > 0).map((item) => (
              <li
                key={item.title}
                className='flex list-none items-center gap-2 rounded-xl bg-white/5 px-2.5 py-2 text-xs font-semibold leading-tight text-white ring-1 ring-white/10 backdrop-blur-sm md:px-4 md:py-2.5 md:text-sm lg:flex-auto'
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

      {/* ───────── Annonces à la une (fond blanc) ───────── */}
      <section className='bg-white text-ink-950'>
        <div className='mx-auto w-[92%] py-6 xl:max-w-6xl lg:py-10'>
          <h2 className='inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-500'>
            <FontAwesomeIcon icon={faStar} className='h-4 w-4' />
            Annonces à la une
          </h2>

          {/* Accès au moteur de recherche, avant la première annonce */}
          <div className='mt-5 flex justify-center'>
            <OtherSellersLink />
          </div>

          {/* Region + "Appeler" / WhatsApp on each card; edit / hide / sold
              controls for a logged-in merchant. */}
          <FeaturedPosts initialPosts={posts} />

          {/* Fin de page : même accès au moteur de recherche */}
          <div className='mt-12 flex justify-center lg:mt-16'>
            <OtherSellersLink />
          </div>
        </div>
      </section>
    </>
  )
}
