import type { Metadata } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLocationDot,
  faScrewdriverWrench,
  faGears,
  faOilCan,
  faSprayCan,
  faWandMagicSparkles,
  faStar,
  faShieldHalved,
  faCircleCheck,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons'
import {
  faWhatsapp,
  faFacebookMessenger
} from '@fortawesome/free-brands-svg-icons'
import { getPublicImages } from '../_lib/media'
import BackgroundCarousel from '../_components/tunisiancars/BackgroundCarousel'

export const metadata: Metadata = {
  title: 'Atelier — Tunisian Cars | Sousse',
  description:
    'Atelier automobile Tunisian Cars à Sousse : restauration complète, mécanique, vidange, nettoyage profond, polissage, lustrage et protection céramique.',
  alternates: { canonical: 'https://autocentral.tn/atelier' }
}

const CONTACT_URL = 'https://m.me/tunisiancars.tn'
const WHATSAPP_URL = 'https://wa.me/21698192053'

const SERVICES = [
  {
    icon: faScrewdriverWrench,
    title: 'Restauration complète',
    text: 'Redonner vie à votre véhicule, de la carrosserie aux moindres finitions.'
  },
  {
    icon: faGears,
    title: 'Mécanique',
    text: 'Diagnostic et interventions mécaniques par des experts passionnés.'
  },
  {
    icon: faOilCan,
    title: 'Vidange',
    text: 'Entretien moteur avec des produits adaptés à votre motorisation.'
  },
  {
    icon: faSprayCan,
    title: 'Nettoyage profond',
    text: 'Detailing intérieur et extérieur, propreté irréprochable jusque dans les détails.'
  },
  {
    icon: faWandMagicSparkles,
    title: 'Polissage',
    text: 'Correction des micro-rayures pour retrouver une carrosserie parfaite.'
  },
  {
    icon: faStar,
    title: 'Lustrage',
    text: 'Une brillance profonde et durable, digne des plus belles pièces.'
  },
  {
    icon: faShieldHalved,
    title: 'Protection céramique',
    text: 'Un bouclier durable contre le temps, les rayures et les agressions.'
  }
]

export default function AtelierPage() {
  const images = getPublicImages('tunisiancars/carousel')

  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className='relative flex min-h-[85svh] items-center overflow-hidden'>
        <BackgroundCarousel
          images={images}
          overlayClassName='bg-gradient-to-b from-black/66 via-black/50 to-black/78'
        />

        <div className='relative z-10 mx-auto w-[92%] xl:max-w-6xl py-28'>
          <img
            src='/tunisiancars/tc_garage_logo.jpeg'
            alt='Tunisian Cars Garage'
            className='h-24 w-24 rounded-2xl object-cover ring-1 ring-white/15 shadow-2xl'
          />
          <p className='mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/80 backdrop-blur'>
            <FontAwesomeIcon
              icon={faLocationDot}
              className='h-3.5 w-3.5 text-brand-400'
            />
            Sousse, Tunisie
          </p>
          <h1 className='mt-5 max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl'>
            L&apos;atelier Tunisian Cars
          </h1>
          <p className='mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/80 lg:text-lg'>
            Service de A à Z par des experts passionnés. Nous prenons soin de
            votre véhicule comme s&apos;il était le nôtre — avec exigence et
            amour du détail.
          </p>

          <div className='mt-9 flex flex-wrap items-center gap-3'>
            <a
              href={CONTACT_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-colors hover:bg-brand-600'
            >
              <FontAwesomeIcon icon={faFacebookMessenger} className='h-4 w-4' />
              Prendre rendez-vous
            </a>
            <a
              href={WHATSAPP_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90'
            >
              <FontAwesomeIcon icon={faWhatsapp} className='h-4 w-4' />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ───────── Prestations ───────── */}
      <section className='bg-white text-ink-950'>
        <div className='mx-auto w-[92%] xl:max-w-6xl py-16 lg:py-24'>
          <div className='max-w-2xl'>
            <p className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500'>
              <FontAwesomeIcon icon={faScrewdriverWrench} className='h-4 w-4' />
              Nos prestations
            </p>
            <h2 className='mt-3 text-3xl font-extrabold tracking-tight lg:text-4xl'>
              Un savoir-faire complet, sous un même toit
            </h2>
            <p className='mt-4 text-pretty leading-relaxed text-ink-600'>
              De la restauration à la protection céramique, chaque étape est
              réalisée par nos experts avec des produits d&apos;exception.
            </p>
          </div>

          <ul className='mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3'>
            {SERVICES.map((service, index) => (
              <li
                key={service.title}
                className='group animate-fade-in-up rounded-2xl border border-ink-100 bg-white p-6 shadow-card-light transition-all duration-300 hover:-translate-y-1 hover:shadow-card-light-hover'
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className='inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white'>
                  <FontAwesomeIcon icon={service.icon} className='h-5 w-5' />
                </span>
                <h3 className='mt-4 text-lg font-bold'>{service.title}</h3>
                <p className='mt-1.5 text-sm leading-relaxed text-ink-600'>
                  {service.text}
                </p>
              </li>
            ))}
          </ul>

          <ul className='mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-600'>
            {[
              'Experts passionnés',
              'Produits premium',
              'Finition irréprochable',
              'Certifié Tunisian Cars'
            ].map((point) => (
              <li key={point} className='inline-flex items-center gap-2'>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className='h-4 w-4 text-brand-500'
                />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className='bg-black text-white'>
        <div className='mx-auto flex w-[92%] xl:max-w-6xl flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center lg:py-16'>
          <div>
            <h2 className='text-2xl font-extrabold tracking-tight lg:text-3xl'>
              Confiez-nous votre véhicule
            </h2>
            <p className='mt-2 text-white/70'>
              Un conseil, un devis, un rendez-vous ? Notre équipe vous répond.
            </p>
          </div>
          <a
            href={CONTACT_URL}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-colors hover:bg-brand-600'
          >
            Nous contacter
            <FontAwesomeIcon icon={faArrowRight} className='h-3.5 w-3.5' />
          </a>
        </div>
      </section>
    </>
  )
}
