import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import {
  faAnglesDown,
  faArrowRight,
  faCircleCheck,
  faGears,
  faLocationDot,
  faOilCan,
  faScrewdriverWrench,
  faShieldHalved,
  faSprayCan,
  faStar,
  faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Metadata } from 'next'
import BackgroundCarousel from '../_components/tunisiancars/BackgroundCarousel'
import { getShuffledPublicImages } from '../_lib/media'

// Rendered per request so the carousel opens on a random photo each visit.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Atelier - Tunisian Cars | Sousse',
  description:
    'Atelier automobile Tunisian Cars à Sousse : restauration complète, mécanique, vidange, nettoyage profond, polissage, lustrage et protection céramique.',
  alternates: { canonical: 'https://tunisiancars.com.tn/atelier' }
}

const CONTACT_URL = 'https://m.me/tunisiancars.tn'
const WHATSAPP_URL = 'https://wa.me/21698192053'

const SERVICES = [
  {
    icon: faScrewdriverWrench,
    title: 'Restauration complète',
    text: 'Redonner vie à votre véhicule, de la carrosserie aux moindres finitions.',
    image: '/tunisiancars/services/restauration.jpg'
  },
  {
    icon: faGears,
    title: 'Mécanique',
    text: 'Diagnostic et interventions mécaniques par des experts.',
    image: '/tunisiancars/services/mecanique.jpg'
  },
  {
    icon: faOilCan,
    title: 'Vidange',
    text: 'Entretien moteur avec des produits adaptés à votre motorisation.',
    image: '/tunisiancars/services/vidange.jpg'
  },
  {
    icon: faSprayCan,
    title: 'Nettoyage profond',
    text: 'Detailing intérieur et extérieur, propreté irréprochable jusque dans les détails.',
    image: '/tunisiancars/services/nettoyage.jpg'
  },
  {
    icon: faWandMagicSparkles,
    title: 'Polissage',
    text: 'Correction des micro-rayures pour retrouver une carrosserie parfaite.',
    image: '/tunisiancars/services/polissage.png'
  },
  {
    icon: faStar,
    title: 'Lustrage',
    text: 'Une brillance profonde et durable, digne des plus belles pièces.',
    image: '/tunisiancars/services/lustrage.png'
  },
  {
    icon: faShieldHalved,
    title: 'Protection céramique',
    text: 'Un bouclier durable contre le temps, les rayures et les agressions.',
    image: '/tunisiancars/services/ceramique.png'
  }
]

export default function AtelierPage() {
  const images = getShuffledPublicImages('tunisiancars/carousel')

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
      <section
        id='prestations'
        className='scroll-mt-14 bg-white text-ink-950 lg:scroll-mt-16'
      >
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

          <ul className='mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-12 lg:grid-cols-3'>
            {SERVICES.map((service, index) => (
              <li
                key={service.title}
                className='group relative animate-fade-in-up overflow-hidden shadow-card-light ring-1 ring-ink-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-light-hover'
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* Image homogène : aspect fixe + object-cover, quelles que soient
                    les dimensions du fichier source. */}
                <div className='aspect-[4/3] overflow-hidden'>
                  <img
                    src={service.image}
                    alt={service.title}
                    loading='lazy'
                    className='h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110'
                  />
                </div>

                <div
                  aria-hidden='true'
                  className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent'
                />

                <div className='absolute inset-x-0 bottom-0 p-5'>
                  <span className='inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur transition-colors duration-300 group-hover:bg-brand-500 group-hover:ring-brand-500'>
                    <FontAwesomeIcon icon={service.icon} className='h-5 w-5' />
                  </span>
                  <h3 className='mt-3 text-lg font-bold text-white drop-shadow'>
                    {service.title}
                  </h3>
                  <p className='mt-1 text-sm leading-relaxed text-white/80'>
                    {service.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
