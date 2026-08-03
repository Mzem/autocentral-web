import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import {
  faArrowRight,
  faArrowUpRightFromSquare,
  faCar,
  faCircleCheck,
  faMagnifyingGlass,
  faScrewdriverWrench,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Metadata } from 'next'
import { CarPostListItem, getCarPosts } from '../api/services/car-posts.service'
import BackgroundCarousel from './_components/tunisiancars/BackgroundCarousel'
import AdminShowroom from './_components/tunisiancars/AdminShowroom'
import AddCarButton from './_components/tunisiancars/AddCarButton'
import FacebookSyncButton from './_components/tunisiancars/FacebookSyncButton'
import { getShuffledPublicImages } from './_lib/media'

// The Tunisian Cars seller whose own listings power the showroom.
const SHOWROOM_MERCHANT_ID = 'tunisian-cars'

// Rendered per request so the server-side image shuffle gives a fresh, random
// first carousel photo on every visit (delivered already-loaded in the HTML).
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  alternates: { canonical: 'https://tunisiancars.com.tn' }
}

async function getShowroomPosts(): Promise<CarPostListItem[]> {
  try {
    // Show every listing (no recency cutoff — the merchant hides what they
    // want). The API already orders them: sold last, then by last edited.
    return await getCarPosts({ page: 1, merchantId: SHOWROOM_MERCHANT_ID })
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
      {/* ───────────── Écran 1 — Hero atelier ─────────────
          Bandeau paysage occupant ~40% de la hauteur d'écran (desktop + mobile),
          image en fond, puis directement la section "en vente". */}
      <section className='relative flex min-h-[45svh] lg:min-h-[51svh] items-center overflow-hidden'>
        <BackgroundCarousel
          images={carouselImages}
          overlayClassName='bg-gradient-to-b from-black/60 via-black/45 to-black/75'
        />

        <div className='relative z-10 mx-auto w-[92%] xl:max-w-6xl py-10 pt-20 md:pt-10'>
          <h1 className='max-w-4xl text-balance text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-6xl'>
            L&apos;automobile d&apos;exception,{' '}
            <span className='text-brand-500'>de A à Z.</span>
          </h1>

          {/* 3 encarts de largeur égale — en mobile, titre seul (icône inline) */}
          <div className='mt-6 grid w-fit grid-cols-1 gap-1.5 md:w-auto md:max-w-4xl md:grid-cols-3 md:gap-3 lg:mt-10'>
            <div className='rounded-xl bg-white/5 px-3 py-2 backdrop-blur-sm md:px-4 md:py-4'>
              <h2 className='flex items-center gap-2 text-xs font-semibold text-white md:text-sm'>
                <FontAwesomeIcon
                  icon={faScrewdriverWrench}
                  className='h-3.5 w-3.5 shrink-0 text-brand-400 md:h-4 md:w-4'
                />
                Mécanique & esthétique premium
              </h2>
              <p className='mt-2 hidden text-xs leading-relaxed text-white/75 md:block'>
                Restauration, vidange, detailing, céramique...
              </p>
            </div>

            <div className='rounded-xl bg-white/5 px-3 py-2 backdrop-blur-sm md:px-4 md:py-4'>
              <h2 className='flex items-center gap-2 text-xs font-semibold text-white md:text-sm'>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className='h-3.5 w-3.5 shrink-0 text-brand-400 md:h-4 md:w-4'
                />
                Vente selectionnée & certifiée
              </h2>
              <p className='mt-2 hidden text-xs leading-relaxed text-white/75 md:block'>
                Vehicules inspectés par nos soins
              </p>
            </div>

            <div className='rounded-xl bg-white/5 px-3 py-2 backdrop-blur-sm md:px-4 md:py-4'>
              <h2 className='flex items-center gap-2 text-xs font-semibold text-white md:text-sm'>
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className='h-3.5 w-3.5 shrink-0 text-brand-400 md:h-4 md:w-4'
                />
                Recherche sur mesure
              </h2>
              <p className='mt-2 hidden text-xs leading-relaxed text-white/75 md:block'>
                Selon vos critères et votre budget
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Écran 2 — Showroom (fond blanc) ───────────── */}
      <section id='vente' className='bg-white text-ink-950'>
        <div className='mx-auto w-[92%] xl:max-w-6xl py-5 lg:py-8'>
          <div className='max-w-2xl'>
            <p className='inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-500'>
              <FontAwesomeIcon icon={faCar} className='h-4 w-4' />
              En vente actuellement
            </p>
          </div>

          <div className='mt-2 lg:mt-3 flex flex-wrap justify-end gap-1'>
            <FacebookSyncButton />
            <AddCarButton />
          </div>

          <div className='mt-1 lg:mt-2'>
            <AdminShowroom initialPosts={showroomPosts} />
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
