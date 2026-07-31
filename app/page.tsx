import type { Metadata } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLocationDot,
  faCar,
  faArrowRight,
  faGem,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import { getCarPosts, CarPostListItem } from '../api/services/car-posts.service'
import { getPublicImages } from './_lib/media'
import BackgroundCarousel from './_components/tunisiancars/BackgroundCarousel'
import ShowroomCars from './_components/tunisiancars/ShowroomCars'

// The Tunisian Cars seller whose own listings power the showroom.
const SHOWROOM_MERCHANT_ID = 'tunisian-cars'
// "Récent" = published within this many days.
const RECENT_DAYS = 60

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
  const carouselImages = getPublicImages('tunisiancars/carousel')
  const clubImages = getPublicImages('tunisiancars/club')
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

          <p className='mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/80 lg:text-lg'>
            Un atelier de passionnés : restauration complète, mécanique,
            vidange, nettoyage profond, polissage, lustrage et protection
            céramique. Et un showroom de véhicules rares, importés sur mesure et
            certifiés par nos experts.
          </p>

          <p className='mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/80 backdrop-blur'>
            <FontAwesomeIcon
              icon={faLocationDot}
              className='h-3.5 w-3.5 text-brand-400'
            />
            Sousse, Tunisie
          </p>
        </div>

        {/* Invitation à descendre vers la sélection — scroll fluide via l'ancre. */}
        <a
          href='#showroom'
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
      <section id='showroom' className='bg-white text-ink-950'>
        <div className='mx-auto w-[92%] xl:max-w-6xl py-16 lg:py-24'>
          <div className='max-w-2xl'>
            <p className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500'>
              <FontAwesomeIcon icon={faCar} className='h-4 w-4' />
              Showroom
            </p>
            <h2 className='mt-3 text-3xl font-extrabold tracking-tight lg:text-4xl'>
              Des véhicules sélectionnés par nos experts
            </h2>
            <p className='mt-4 text-pretty leading-relaxed text-ink-600'>
              Vente de véhicules et d&apos;articles d&apos;exception,
              importation sur mesure — rapide et soignée. Chaque voiture est
              inspectée et certifiée par notre atelier{' '}
              <span className='font-semibold text-ink-900'>
                @tunisiancarsgarage
              </span>
              .
            </p>
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
              icon={faGem}
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
              href='https://www.facebook.com/tunisiancars.tn'
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
