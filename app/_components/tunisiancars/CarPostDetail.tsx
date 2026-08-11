'use client'

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import {
  faCalendarDays,
  faChevronDown,
  faClock,
  faGasPump,
  faGaugeHigh,
  faGears,
  faLocationDot,
  faOilCan,
  faPhone,
  faShareNodes,
  faShop
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState, type ReactNode } from 'react'
import { CarPost } from '../../../api/services/car-posts.service'
import { dotNumber, noPriceText } from '../../helpers'
import { fuelLabel } from '../../types'
import { Linkify } from '../../Linkify'
import DetailGallery from './DetailGallery'
import CarPostCard from '../car-posts/CarPostCard'

const SHOWROOM_MERCHANT_ID = 'tunisian-cars'

// A usable phone/whatsapp number: not blank, not a malformed "+216undefined"
// style value, and with at least a handful of real digits.
const isValid = (v: unknown) => {
  const s = String(v ?? '')
    .trim()
    .toLowerCase()
  if (!s || s.includes('undefined') || s.includes('null')) return false
  return s.replace(/\D/g, '').length >= 6
}

function Skeleton() {
  return (
    <div className='animate-pulse'>
      <div className='mx-auto w-full max-w-2xl px-4 py-6 lg:py-8'>
        <div className='aspect-[4/3] w-full rounded-lg bg-ink-100' />
        <div className='mt-5 space-y-4'>
          <div className='h-8 w-2/3 rounded bg-ink-100' />
          <div className='h-10 w-1/3 rounded bg-ink-100' />
        </div>
      </div>
    </div>
  )
}

function Content({ post }: { post: CarPost }) {
  const [ficheOpen, setFicheOpen] = useState(false)

  const title =
    post.title ?? (`${post.make ?? ''} ${post.model ?? ''}`.trim() || 'Annonce')

  const rawPhones =
    post.phones && post.phones.length > 0
      ? post.phones
      : post.phone
      ? [post.phone]
      : []
  const phones = rawPhones.filter(isValid)

  const isTunisianCars = post.merchant?.id === SHOWROOM_MERCHANT_ID
  // Only genuine Tunisian Cars sales expose the shop's contact. On-behalf and
  // external (scraped) listings show nothing here (their contact is elsewhere).
  const showContact = isTunisianCars && !post.isOnBehalf
  const showSimilar =
    !isTunisianCars && !!post.similar && post.similar.length > 0
  const hasOptions = !!post.options && post.options.length > 1

  // Spec values (each shown on its own line group).
  const yearVal = post.year ? `${post.year}` : null
  const kmVal = post.km != null ? `${dotNumber(post.km)} km` : null
  const motorVal =
    `${post.cylinder ? post.cylinder + ' ' : ''}${
      post.cv ? post.cv + ' cv' : ''
    }`.trim() || null
  const fuelVal = post.fuel ? fuelLabel(post.fuel) : null
  const gearboxVal = post.gearbox || null
  // Region for Tunisian Cars listings (incl. on-behalf); hidden for external.
  const regionVal = isTunisianCars ? post.region?.name || null : null

  const eng = post.carEngine
  const consumption =
    eng && eng.urban && eng.highway
      ? `${
          Math.ceil((0.37 * eng.urban + 0.63 * eng.highway) * 10) / 10
        } L/100km`
      : null
  const hasSpecs = !!(
    yearVal ||
    kmVal ||
    motorVal ||
    fuelVal ||
    gearboxVal ||
    regionVal ||
    eng
  )

  const share = () => {
    const url = `https://tunisiancars.com.tn/annonces/${post.id}`
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title, url }).catch(() => {})
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {})
    }
  }

  // One spec: white icon + label/value, for the dark specs band.
  const specItem = (
    icon: IconDefinition,
    label: string,
    value: string | null
  ) =>
    value ? (
      <div className='flex items-center gap-2.5'>
        <FontAwesomeIcon icon={icon} className='h-4 w-4 shrink-0 text-white' />
        <div className='min-w-0'>
          <dt className='text-[0.6rem] font-medium uppercase tracking-wide text-white/45'>
            {label}
          </dt>
          <dd className='truncate text-sm font-semibold'>{value}</dd>
        </div>
      </div>
    ) : null

  // One "fiche technique" row (label ─ value).
  const ficheRow = (label: string, value: string | null | undefined) =>
    value ? (
      <div className='flex items-center justify-between gap-4 border-b border-white/10 pb-2'>
        <dt className='text-xs text-white/50'>{label}</dt>
        <dd className='text-sm font-semibold text-white'>{value}</dd>
      </div>
    ) : null

  const priceNode = post.price ? (
    <p className='text-3xl font-extrabold text-brand-600'>
      {dotNumber(post.price)} DT
    </p>
  ) : post.estimatedPrice?.value ? (
    <p className='inline-flex items-baseline gap-2 text-xl bg-ink-50 p-2 rounded-md font-extrabold text-ink-300'>
      {dotNumber(post.estimatedPrice.value)} DT estimé
    </p>
  ) : (
    <p className='text-2xl font-bold text-ink-500'>
      {noPriceText(post.merchant?.id)}
    </p>
  )

  // Sections. Each carries a fixed background so specs & description are always
  // white-on-black (legible), while details / contact / similar stay white.
  const bands: { key: string; dark: boolean; node: ReactNode }[] = [
    {
      key: 'main',
      dark: false,
      node: (
        <>
          <DetailGallery
            images={post.images}
            source={post.source}
            sourceUrl={post.urlSource}
          />
          <div className='mt-5'>
            {post.isExpired && (
              <span className='mb-3 inline-flex w-fit items-center rounded-md bg-red/70 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white'>
                Vendu
              </span>
            )}
            <h1 className='text-2xl font-extrabold leading-tight tracking-tight lg:text-3xl'>
              {title}
            </h1>
            <p className='mt-1 text-sm text-ink-500'>
              {[post.year, post.make, post.model].filter(Boolean).join(' ')}
            </p>
            {post.publishedAtText && (
              <p className='mt-1.5 inline-flex items-center gap-1.5 text-xs text-ink-400'>
                <FontAwesomeIcon icon={faClock} className='h-3 w-3' />
                Publié {post.publishedAtText}
              </p>
            )}
            <div className='mt-4'>{priceNode}</div>
            <button
              type='button'
              onClick={share}
              className='mt-4 inline-flex items-center gap-2 rounded-lg border border-ink-200 px-3.5 py-1.5 text-xs font-semibold text-ink-700 transition-colors hover:bg-ink-50'
            >
              <FontAwesomeIcon icon={faShareNodes} className='h-3.5 w-3.5' />
              Partager
            </button>
          </div>
        </>
      )
    }
  ]

  if (hasSpecs) {
    bands.push({
      key: 'specs',
      dark: true,
      node: (
        <>
          <dl className='space-y-3'>
            {/* Two-column grid so Kilométrage and Carburant line up at the
                half (aligned under each other). */}
            {(yearVal || kmVal) && (
              <div className='grid grid-cols-2 gap-x-6'>
                <div>{specItem(faCalendarDays, 'Année', yearVal)}</div>
                <div>{specItem(faGaugeHigh, 'Kilométrage', kmVal)}</div>
              </div>
            )}
            {(motorVal || fuelVal) && (
              <div className='grid grid-cols-2 gap-x-6'>
                <div>{specItem(faOilCan, 'Motorisation', motorVal)}</div>
                <div>{specItem(faGasPump, 'Carburant', fuelVal)}</div>
              </div>
            )}
            {specItem(faGears, 'Boîte', gearboxVal)}
            {specItem(faLocationDot, 'Localisation', regionVal)}
          </dl>

          {hasOptions && (
            <div className='mt-6'>
              <p className='text-[0.6rem] font-medium uppercase tracking-wide text-white/45'>
                Options
              </p>
              <div className='mt-2 flex flex-wrap gap-2'>
                {post.options!.map((option, i) => (
                  <span
                    key={i}
                    className='rounded-md bg-white/10 px-3 py-1 text-xs font-medium text-white/90'
                  >
                    {option}
                  </span>
                ))}
              </div>
            </div>
          )}

          {eng && (
            <div className='mt-6 border-t border-white/10 pt-4'>
              <button
                type='button'
                onClick={() => setFicheOpen((o) => !o)}
                className='flex w-full items-center justify-between gap-2 text-left text-sm font-semibold text-white'
              >
                Fiche technique (données tunisiancars)
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`h-3.5 w-3.5 shrink-0 text-white/70 transition-transform ${
                    ficheOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {ficheOpen && (
                <dl className='mt-4 space-y-2'>
                  {ficheRow('Motorisation', eng.engineName)}
                  {ficheRow('Cylindrée', eng.cylinder)}
                  {ficheRow('Carburant', eng.fuel ? fuelLabel(eng.fuel) : null)}
                  {ficheRow('Puissance', eng.hp ? `${eng.hp} ch` : null)}
                  {ficheRow('Couple', eng.torque ? `${eng.torque} Nm` : null)}
                  {ficheRow(
                    '0–100 km/h',
                    eng.acceleration ? `${eng.acceleration} s` : null
                  )}
                  {ficheRow(
                    'Vitesse max',
                    eng.vmax ? `${eng.vmax} km/h` : null
                  )}
                  {ficheRow('Consommation', consumption)}
                  {ficheRow('Fiabilité', eng.note ? `${eng.note}/10` : null)}
                  {eng.pbs && (
                    <p className='pt-1 text-xs leading-relaxed text-white/55'>
                      {eng.pbs}
                    </p>
                  )}
                </dl>
              )}
            </div>
          )}
        </>
      )
    })
  }

  if (showContact) {
    bands.push({
      key: 'contact',
      dark: false,
      node: (
        <div className='flex flex-col gap-4'>
          <p className='inline-flex items-center gap-2 text-sm font-bold'>
            <FontAwesomeIcon icon={faShop} className='h-4 w-4 text-brand-500' />
            Vendu par Tunisian Cars
          </p>
          <div className='flex flex-col gap-2.5'>
            {phones.map((phone) => {
              const digits = phone.toString().replace(/\D/g, '')
              return (
                <div key={phone} className='flex items-center gap-2'>
                  <a
                    href={`tel:${phone}`}
                    className='inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600'
                  >
                    <FontAwesomeIcon icon={faPhone} className='h-3.5 w-3.5' />
                    {dotNumber(phone.toString().replace('+216', ''))}
                  </a>
                  <a
                    href={`https://wa.me/${digits}?text=${encodeURIComponent(
                      `Bonjour, votre annonce ${title} m'intéresse - https://tunisiancars.com.tn/annonces/${post.id}`
                    )}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='WhatsApp'
                    className='inline-flex items-center gap-1.5 rounded-lg bg-whatsapp px-3.5 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90'
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className='h-4 w-4' />
                    WhatsApp
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      )
    })
  }

  if (post.description) {
    bands.push({
      key: 'desc',
      dark: true,
      node: (
        <>
          <h2 className='text-[0.7rem] font-semibold uppercase tracking-wide text-white/45'>
            Description
          </h2>
          <p className='mt-2 text-sm leading-relaxed text-white/80'>
            {post.description.split('\n').map((line, i) => (
              <span key={i}>
                <Linkify text={line} />
                <br />
              </span>
            ))}
          </p>
        </>
      )
    })
  }

  if (showSimilar) {
    bands.push({
      key: 'similar',
      dark: false,
      node: (
        <>
          <h2 className='mb-6 text-xl font-extrabold tracking-tight'>
            Véhicules similaires
          </h2>
          {/* Standard (non-admin) cards — 2 per row then 1, like ShowroomCars. */}
          <ul className='grid grid-cols-1 gap-5 md:grid-cols-2'>
            {post.similar!.map((similar) => (
              <CarPostCard key={similar.id} post={similar} replaceNav />
            ))}
          </ul>
        </>
      )
    })
  }

  return (
    <article>
      {bands.map((band) => (
        <section
          key={band.key}
          className={
            band.dark ? 'bg-ink-950 text-white' : 'bg-white text-ink-950'
          }
        >
          <div className='mx-auto w-full max-w-2xl px-4 py-6 lg:py-8'>
            {band.node}
          </div>
        </section>
      ))}
    </article>
  )
}

/**
 * Renders a listing detail. On the full page it receives the already-fetched
 * `post` (SSR). In the modal it receives only `postId` and fetches on the
 * client - so the modal opens instantly and shows a loading skeleton while the
 * data arrives.
 */
export default function CarPostDetail({
  post: postProp,
  postId
}: {
  post?: CarPost
  postId?: string
}) {
  const [state, setState] = useState<CarPost | null | 'error' | 'notfound'>(
    postProp ?? null
  )

  useEffect(() => {
    if (postProp || !postId) return
    let active = true
    fetch(`/api/car-post?postId=${postId}`)
      .then((res) => res.json())
      .then((p) => {
        if (active) setState(p && p.id ? (p as CarPost) : 'notfound')
      })
      .catch(() => {
        if (active) setState('error')
      })
    return () => {
      active = false
    }
  }, [postId, postProp])

  if (state === null) return <Skeleton />
  if (state === 'error')
    return (
      <div className='py-12 text-center text-ink-500'>
        Impossible de charger l&apos;annonce.
      </div>
    )
  if (state === 'notfound')
    return (
      <div className='py-10 text-center text-ink-500'>
        Annonce introuvable ou expirée.
      </div>
    )
  return <Content post={state} />
}
