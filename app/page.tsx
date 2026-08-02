import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import {
  faArrowRight,
  faArrowUpRightFromSquare,
  faCar,
  faChevronDown,
  faCircleCheck,
  faScrewdriverWrench,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Metadata } from 'next'
import { CarPostListItem, getCarPosts } from '../api/services/car-posts.service'
import BackgroundCarousel from './_components/tunisiancars/BackgroundCarousel'
import ShowroomCars from './_components/tunisiancars/ShowroomCars'
import { getShuffledPublicImages } from './_lib/media'

// The Tunisian Cars seller whose own listings power the showroom.
const SHOWROOM_MERCHANT_ID = 'tunisian-cars'
// "Récent" = published within this many days.
const RECENT_DAYS = 60

// Rendered per request so the server-side image shuffle gives a fresh, random
// first carousel photo on every visit (delivered already-loaded in the HTML).
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  alternates: { canonical: 'https://autocentral.tn' }
}

async function getShowroomPosts(): Promise<CarPostListItem[]> {
  try {
    // Single API call, as specified.
    const posts = await getCarPosts({
      page: 1,
      merchantId: SHOWROOM_MERCHANT_ID
    })
    const cutoff = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000
    return posts
      .filter((p) => {
        const t = Date.parse(p.publishedAt)
        return Number.isNaN(t) ? true : t >= cutoff
      })
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
  } catch {
    // API unreachable / merchant not created yet → clean empty state.
    return []
  }
}

export default async function Home() {
  const carouselImages = getShuffledPublicImages('tunisiancars/carousel')
  const clubImages = getShuffledPublicImages('tunisiancars/club')
  const showroomPosts = await getShowroomPosts()

  return (
    <>
      {/* ───────────── Écran 1 — Hero atelier + showroom ───────────── */}
      <section className='relative flex min-h-[100svh] items-center overflow-hidden'>
        <BackgroundCarousel
          images={carouselImages}
          overlayClassName='bg-gradient-to-b from-black/60 via-black/45 to-black/75'
        />

        <div className='relative z-10 mx-auto w-[92%] xl:max-w-6xl py-28 lg:py-24'>
          <h1 className='max-w-4xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl'>
            L&apos;automobile d&apos;exception,{' '}
            <span className='text-brand-500'>de A à Z.</span>
          </h1>

          {/* 3 encarts de largeur égale — en mobile, titre seul (icône inline) */}
          <div className='mt-8 grid w-fit grid-cols-1 gap-2 md:w-auto md:max-w-4xl md:grid-cols-3 md:gap-3 lg:mt-10'>
            <div className='rounded-xl bg-white/5 px-4 py-3 backdrop-blur-sm md:py-4'>
              <h2 className='flex items-center gap-2 text-sm font-semibold text-white'>
                <FontAwesomeIcon
                  icon={faScrewdriverWrench}
                  className='h-4 w-4 shrink-0 text-brand-400'
                />
                Mécanique & esthétique premium
              </h2>
              <p className='mt-2 hidden text-xs leading-relaxed text-white/75 md:block'>
                Restauration, vidange, detailing, céramique...
              </p>
            </div>

            <div className='rounded-xl bg-white/5 px-4 py-3 backdrop-blur-sm md:py-4'>
              <h2 className='flex items-center gap-2 text-sm font-semibold text-white'>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className='h-4 w-4 shrink-0 text-brand-400'
                />
                Vente selectionnée & certifiée
              </h2>
              <p className='mt-2 hidden text-xs leading-relaxed text-white/75 md:block'>
                Vehicules inspectés par nos soins
              </p>
            </div>

            <div className='rounded-xl bg-white/5 px-4 py-3 backdrop-blur-sm md:py-4'>
              <h2 className='flex items-center gap-2 text-sm font-semibold text-white'>
                <span className='inline-flex h-3.5 w-5 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-white/20'>
                  <svg
                    viewBox='0 0 5 3'
                    preserveAspectRatio='none'
                    className='h-full w-full'
                    aria-hidden='true'
                  >
                    <rect width='5' height='1' fill='#000000' />
                    <rect y='1' width='5' height='1' fill='#DD0000' />
                    <rect y='2' width='5' height='1' fill='#FFCE00' />
                  </svg>
                </span>
                Import sur mesure
              </h2>
              <p className='mt-2 hidden text-xs leading-relaxed text-white/75 md:block'>
                Rapide, fiable et sécurisée, selon vos critères
              </p>
            </div>
          </div>
        </div>

        {/* Invitation à descendre vers la sélection — scroll fluide via l'ancre. */}
        <a
          href='#vente'
          aria-label='Voir la sélection de voitures'
          className='group absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2.5 text-white/85 transition-colors hover:text-white'
        >
          <span className='text-[0.7rem] font-medium uppercase tracking-[0.2em]'>
            Voir la sélection
          </span>
          <span className='flex h-11 w-11 animate-bounce items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur transition-colors group-hover:border-white/70 group-hover:bg-white/20'>
            <FontAwesomeIcon icon={faChevronDown} className='h-4 w-4' />
          </span>
        </a>
      </section>

      {/* ───────────── Écran 2 — Showroom (fond blanc) ───────────── */}
      <section id='vente' className='bg-white text-ink-950'>
        <div className='mx-auto w-[92%] xl:max-w-6xl py-16 lg:py-24'>
          <div className='max-w-2xl'>
            <p className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500'>
              <FontAwesomeIcon icon={faCar} className='h-4 w-4' />
              En vente actuellement
            </p>
            <h2 className='mt-3 text-2xl font-extrabold tracking-tight lg:text-4xl'>
              Des véhicules sélectionnés et inspectés par nos experts
            </h2>
            <a
              href='https://www.facebook.com/tunisiancarsgaragesousse'
              target='_blank'
              rel='noopener noreferrer'
              className='mt-5 inline-flex items-center gap-2 rounded-xl  bg-ink-50 px-4 py-2.5 text-sm font-medium text-ink-800 transition-colors hover:border-brand-500/40 hover:bg-brand-500/5'
            >
              <span>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className='mr-2 h-4 w-4 text-brand-500'
                />
                Certifiés par{' '}
                <span className='font-semibold text-ink-950'>
                  Tunisian CARS Garage
                </span>
              </span>
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className='h-3 w-3 shrink-0 text-ink-400'
              />
            </a>
          </div>

          <div className='mt-10 lg:mt-12'>
            <ShowroomCars posts={showroomPosts} />
          </div>
        </div>
      </section>

      {/* ───────────── Écran 3 — Le club (carousel) ───────────── */}
      <section className='relative flex min-h-[100svh] items-center overflow-hidden'>
        <BackgroundCarousel
          images={clubImages}
          intervalMs={7000}
          overlayClassName='bg-black/50'
        />

        <div className='relative z-10 mx-auto w-[92%] xl:max-w-3xl py-24 text-center lg:py-28'>
          <p className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/80 backdrop-blur'>
            <FontAwesomeIcon
              icon={faUsers}
              className='h-3.5 w-3.5 text-brand-400'
            />
            Tunisian Cars Club
          </p>
          <h2 className='mt-6 text-balance text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl'>
            Une communauté de passionnés unique en Tunisie
          </h2>
          <p className='mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-white/80'>
            Des rassemblements, des routes mythiques et une même exigence :
            l&apos;amour du beau véhicule. Rejoignez celles et ceux qui vivent
            l&apos;automobile autrement.
          </p>
          <div className='mt-8 flex justify-center'>
            <a
              href='https://www.instagram.com/tunisiancars.tn'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10'
            >
              <FontAwesomeIcon icon={faInstagram} className='h-4 w-4' />
              Rejoindre la communauté
              <FontAwesomeIcon icon={faArrowRight} className='h-3.5 w-3.5' />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
