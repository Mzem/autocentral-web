import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import {
  faAnglesDown,
  faLocationDot,
  faScrewdriverWrench
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Metadata } from 'next'
import BackgroundCarousel from '../_components/tunisiancars/BackgroundCarousel'
import PrestationsCarousel from '../_components/tunisiancars/PrestationsCarousel'
import RealisationsSection from '../_components/tunisiancars/RealisationsSection'
import {
  getRealisations,
  RealisationItem
} from '../../api/services/realisations.service'
import { getShuffledPublicImages } from '../_lib/media'

// ISR: same page for everyone (admin realisations refetch client-side), so we
// render once and revalidate every 2 min instead of a full uncached SSR per
// request. The hero's random first photo now rotates per revalidation window —
// imperceptible, and it makes the HTML cacheable (browser + Cloudflare edge).
export const revalidate = 120

export const metadata: Metadata = {
  title: 'Atelier - Tunisian Cars | Sousse',
  description:
    'Atelier automobile Tunisian Cars à Sousse : restauration complète, mécanique, vidange, nettoyage profond, polissage, lustrage et protection céramique.',
  alternates: { canonical: 'https://tunisiancars.com.tn/atelier' }
}

const CONTACT_URL = 'https://m.me/tunisiancars.tn'
const WHATSAPP_URL = 'https://wa.me/21698192053'

export default async function AtelierPage() {
  const images = getShuffledPublicImages('tunisiancars/carousel')
  const realisations: RealisationItem[] = await getRealisations()

  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className='relative flex min-h-[100svh] items-center overflow-hidden'>
        <BackgroundCarousel
          images={images}
          overlayClassName='bg-gradient-to-b from-black/66 via-black/50 to-black/78'
        />

        <div className='relative z-10 mx-auto w-[92%] xl:max-w-6xl py-28'>
          <img
            src='/tunisiancars/tc_garage_logo.jpeg'
            alt='Tunisian Cars Garage'
            className='h-24 w-24 rounded object-cover shadow-2xl'
          />
          <p className='mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/80 backdrop-blur'>
            <FontAwesomeIcon
              icon={faLocationDot}
              className='h-3.5 w-3.5 text-brand-400'
            />
            Sousse, Tunisie
          </p>
          <h1 className='mt-5 max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl'>
            Tunisian Cars Garage
          </h1>
          <p className='mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/80 lg:text-lg'>
            Service de A à Z par des experts passionnés
          </p>

          <div className='mt-9 flex flex-wrap items-center gap-3'>
            <a
              href={WHATSAPP_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90'
            >
              <FontAwesomeIcon icon={faWhatsapp} className='h-4 w-4' />
              Prendre rendez-vous
            </a>
          </div>
        </div>

        {/* Invitation à scroller vers les prestations */}
        <a
          href='#prestations'
          aria-label='Découvrir nos services'
          className='absolute inset-x-0 bottom-6 z-10 mx-auto flex w-fit flex-col items-center gap-2 text-white/75 transition-colors hover:text-white'
        >
          <span className='text-[0.7rem] font-semibold uppercase tracking-[0.25em]'>
            Découvrir nos services
          </span>
          <FontAwesomeIcon
            icon={faAnglesDown}
            className='h-4 w-4 animate-bounce'
          />
        </a>
      </section>

      {/* ───────── Prestations ───────── */}
      <section id='prestations' className='scroll-mt-10 bg-white text-ink-950'>
        <div className='mx-auto w-[92%] xl:max-w-6xl py-16 lg:py-24'>
          <div className='max-w-2xl'>
            <p className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500'>
              <FontAwesomeIcon icon={faScrewdriverWrench} className='h-4 w-4' />
              Nos prestations
            </p>
            <h2 className='mt-3 text-3xl font-extrabold tracking-tight lg:text-4xl'>
              Un savoir-faire complet
            </h2>
            <p className='mt-4 text-pretty leading-relaxed text-ink-600'>
              De la restauration mécanique à la protection céramique, chaque
              étape est réalisée par nos experts avec un soin exceptionnel,
              garantissant un résultat à la hauteur de vos attentes.
            </p>
          </div>

          <PrestationsCarousel />
        </div>
      </section>

      {/* ───────── Nos réalisations récentes ───────── */}
      <RealisationsSection initialItems={realisations} />
    </>
  )
}
