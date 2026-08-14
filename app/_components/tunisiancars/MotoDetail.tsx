'use client'

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import {
  faCalendarDays,
  faClock,
  faGaugeHigh,
  faGears,
  faLocationDot,
  faPhone,
  faShareNodes,
  faShop
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState, type ReactNode } from 'react'
import { MotoListItem } from '../../../api/services/moto-posts.service'
import { dotNumber, noPriceText } from '../../helpers'
import { Linkify } from '../../Linkify'
import DetailGallery from './DetailGallery'

// A usable phone/whatsapp number (not blank, not a malformed value).
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

function Content({ moto }: { moto: MotoListItem }) {
  const title =
    moto.title ?? (`${moto.make ?? ''} ${moto.model ?? ''}`.trim() || 'Moto')

  const rawPhones =
    moto.phones && moto.phones.length > 0
      ? moto.phones
      : moto.phone
      ? [moto.phone]
      : []
  const phones = rawPhones.filter(isValid)

  const yearVal = moto.year ? `${moto.year}` : null
  const kmVal = moto.km != null ? `${dotNumber(moto.km)} km` : null
  const ccVal = moto.cc ? `${moto.cc} cc` : null
  const regionVal = moto.region?.name || null
  const hasSpecs = !!(yearVal || kmVal || ccVal || regionVal)

  const share = () => {
    const url = `https://tunisiancars.com.tn/annonces/moto/${moto.id}`
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title, url }).catch(() => {})
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {})
    }
  }

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

  const priceNode = moto.price ? (
    <p className='text-3xl font-extrabold text-brand-600'>
      {dotNumber(moto.price)} DT
    </p>
  ) : (
    <p className='text-2xl font-bold text-ink-500'>
      {noPriceText('tunisian-cars')}
    </p>
  )

  const bands: { key: string; dark: boolean; node: ReactNode }[] = [
    {
      key: 'main',
      dark: false,
      node: (
        <>
          <DetailGallery images={moto.images} />
          <div className='mt-5'>
            {moto.isExpired && (
              <span className='mb-3 inline-flex w-fit items-center rounded-md bg-red/70 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white'>
                Vendu
              </span>
            )}
            <h1 className='text-2xl font-extrabold leading-tight tracking-tight lg:text-3xl'>
              {title}
            </h1>
            <p className='mt-1 text-sm text-ink-500'>
              {[moto.year, moto.make, moto.model].filter(Boolean).join(' ')}
            </p>
            {moto.publishedAtText && (
              <p className='mt-1.5 inline-flex items-center gap-1.5 text-xs text-ink-400'>
                <FontAwesomeIcon icon={faClock} className='h-3 w-3' />
                Publié {moto.publishedAtText}
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
        <dl className='space-y-3'>
          {(yearVal || kmVal) && (
            <div className='grid grid-cols-2 gap-x-6'>
              <div>{specItem(faCalendarDays, 'Année', yearVal)}</div>
              <div>{specItem(faGaugeHigh, 'Kilométrage', kmVal)}</div>
            </div>
          )}
          {(ccVal || regionVal) && (
            <div className='grid grid-cols-2 gap-x-6'>
              <div>{specItem(faGears, 'Cylindrée', ccVal)}</div>
              <div>{specItem(faLocationDot, 'Localisation', regionVal)}</div>
            </div>
          )}
        </dl>
      )
    })
  }

  if (phones.length > 0) {
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
                <div key={phone} className='flex flex-wrap items-center gap-2'>
                  <a
                    href={`tel:${phone}`}
                    className='inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600'
                  >
                    <FontAwesomeIcon icon={faPhone} className='h-3.5 w-3.5' />
                    {dotNumber(phone.toString().replace('+216', ''))}
                  </a>
                  <a
                    href={`https://wa.me/${digits}?text=${encodeURIComponent(
                      `Bonjour, votre annonce ${title} m'intéresse - https://tunisiancars.com.tn/annonces/moto/${moto.id}`
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

  if (moto.description) {
    bands.push({
      key: 'desc',
      dark: true,
      node: (
        <>
          <h2 className='text-[0.7rem] font-semibold uppercase tracking-wide text-white/45'>
            Description
          </h2>
          <p className='mt-2 text-sm leading-relaxed text-white/80'>
            {moto.description.split('\n').map((line, i) => (
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
 * Moto listing detail. On the full page it receives the already-fetched `moto`
 * (SSR); in the modal it receives only `motoId` and fetches on the client (with
 * a skeleton) - mirrors CarPostDetail exactly.
 */
export default function MotoDetail({
  moto: motoProp,
  motoId
}: {
  moto?: MotoListItem
  motoId?: string
}) {
  const [state, setState] = useState<
    MotoListItem | null | 'error' | 'notfound'
  >(motoProp ?? null)

  useEffect(() => {
    if (motoProp || !motoId) return
    let active = true
    fetch(`/api/moto-post?postId=${motoId}`)
      .then((res) => res.json())
      .then((p) => {
        if (active) setState(p && p.id ? (p as MotoListItem) : 'notfound')
      })
      .catch(() => {
        if (active) setState('error')
      })
    return () => {
      active = false
    }
  }, [motoId, motoProp])

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
  return <Content moto={state} />
}
