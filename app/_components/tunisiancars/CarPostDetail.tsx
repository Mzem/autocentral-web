'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPhone,
  faLocationDot,
  faGasPump,
  faGears,
  faGaugeHigh,
  faCalendarDays,
  faOilCan,
  faShareNodes,
  faStore,
  faCircleCheck
} from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { CarPost } from '../../../api/services/car-posts.service'
import { dotNumber } from '../../helpers'
import { Linkify } from '../../Linkify'
import DetailGallery from './DetailGallery'
import ShowroomCars from './ShowroomCars'

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
      <div className='grid gap-6 lg:grid-cols-2 lg:gap-10'>
        <div className='aspect-square w-full rounded-lg bg-ink-100' />
        <div className='space-y-4'>
          <div className='h-8 w-2/3 rounded bg-ink-100' />
          <div className='h-10 w-1/3 rounded bg-ink-100' />
          <div className='grid grid-cols-2 gap-4 pt-2'>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className='h-10 rounded bg-ink-100' />
            ))}
          </div>
          <div className='h-11 w-40 rounded-lg bg-ink-100' />
        </div>
      </div>
    </div>
  )
}

function Content({ post }: { post: CarPost }) {
  const title =
    post.title ?? (`${post.make ?? ''} ${post.model ?? ''}`.trim() || 'Annonce')

  const rawPhones =
    post.phones && post.phones.length > 0
      ? post.phones
      : post.phone
      ? [post.phone]
      : []
  const phones = rawPhones.filter(isValid)

  const hideSimilar = post.merchant?.id === SHOWROOM_MERCHANT_ID

  const estimationColor =
    post.estimatedPrice?.color === 'GREEN'
      ? 'text-success'
      : post.estimatedPrice?.color === 'RED'
      ? 'text-danger'
      : 'text-ink-500'

  const specs = [
    post.year && {
      icon: faCalendarDays,
      label: 'Année',
      value: `${post.year}`
    },
    post.km !== undefined &&
      post.km !== null && {
        icon: faGaugeHigh,
        label: 'Kilométrage',
        value: `${dotNumber(post.km)} km`
      },
    post.fuel && { icon: faGasPump, label: 'Carburant', value: post.fuel },
    post.gearbox && { icon: faGears, label: 'Boîte', value: post.gearbox },
    (post.cv || post.cylinder) && {
      icon: faOilCan,
      label: 'Motorisation',
      value: `${post.cylinder ? post.cylinder + ' ' : ''}${
        post.cv ? post.cv + ' cv' : ''
      }`.trim()
    },
    post.region?.name && {
      icon: faLocationDot,
      label: 'Localisation',
      value: post.region.name
    }
  ].filter(Boolean) as { icon: typeof faPhone; label: string; value: string }[]

  const share = () => {
    const url = `https://tunisiancars.com.tn/annonces/${post.id}`
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title, url }).catch(() => {})
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {})
    }
  }

  return (
    <article className='text-ink-950'>
      <div className='grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-10'>
        {/* Galerie — remplit la colonne de gauche, swipe + plein écran */}
        <DetailGallery
          images={post.images}
          source={post.source}
          sourceUrl={post.urlSource}
        />

        {/* Infos */}
        <div className='flex flex-col'>
          {post.isExpired && (
            <span className='mb-3 inline-flex w-fit items-center rounded-lg bg-ink-950 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white'>
              Vendu
            </span>
          )}

          <h1 className='text-2xl font-extrabold leading-tight tracking-tight lg:text-3xl'>
            {title}
          </h1>
          <p className='mt-1 text-sm text-ink-400'>
            {[post.year, post.make, post.model].filter(Boolean).join(' ')}
          </p>

          <div className='mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1'>
            <span className='text-3xl font-extrabold'>
              {post.price ? `${dotNumber(post.price)} DT` : 'Prix N.C.'}
            </span>
            {post.estimatedPrice && (
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-semibold ${estimationColor}`}
              >
                <FontAwesomeIcon icon={faCircleCheck} className='h-3.5 w-3.5' />
                {post.estimatedPrice.text}
              </span>
            )}
          </div>

          {/* Specs — cartes */}
          <dl className='mt-6 grid grid-cols-2 gap-2.5 lg:grid-cols-3'>
            {specs.map((spec) => (
              <div
                key={spec.label}
                className='flex items-center gap-2.5 rounded-lg bg-ink-50 p-2.5 ring-1 ring-ink-100 transition-colors hover:bg-brand-500/5'
              >
                <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500'>
                  <FontAwesomeIcon icon={spec.icon} className='h-4 w-4' />
                </span>
                <div className='min-w-0'>
                  <dt className='text-[0.6rem] font-medium uppercase tracking-wide text-ink-400'>
                    {spec.label}
                  </dt>
                  <dd className='truncate text-sm font-bold'>{spec.value}</dd>
                </div>
              </div>
            ))}
          </dl>

          {/* Vendeur — centré */}
          {post.merchant?.name && (
            <Link
              href={`/${post.merchant.id}`}
              className='mx-auto mt-6 inline-flex w-fit items-center gap-2 rounded-lg border border-ink-200 bg-ink-50 px-4 py-2 text-sm font-semibold transition-colors hover:border-brand-500/40 hover:bg-brand-500/5'
            >
              <FontAwesomeIcon
                icon={faStore}
                className='h-3.5 w-3.5 text-brand-500'
              />
              {post.merchant.name}
            </Link>
          )}

          {/* Contact — un WhatsApp par numéro, centré */}
          <div className='mt-5 flex flex-col items-center gap-2.5'>
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
                      `Bonjour, votre annonce ${title} m'intéresse — https://tunisiancars.com.tn/annonces/${post.id}`
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

          {/* Partager — seul sur sa ligne, centré */}
          <div className='mt-3 flex justify-center'>
            <button
              type='button'
              onClick={share}
              aria-label='Partager'
              className='inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-1.5 text-sm font-semibold text-ink-800 transition-colors hover:bg-ink-50'
            >
              <FontAwesomeIcon icon={faShareNodes} className='h-4 w-4' />
              Partager
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      {post.description && (
        <div className='mt-8 rounded-lg bg-ink-100 p-5 lg:p-6'>
          <h2 className='text-sm font-bold uppercase tracking-wide text-ink-500'>
            Description
          </h2>
          <p className='mt-2 text-sm leading-relaxed text-ink-700'>
            {post.description.split('\n').map((line, i) => (
              <span key={i}>
                <Linkify text={line} />
                <br />
              </span>
            ))}
          </p>
        </div>
      )}

      {/* Options */}
      {post.options && post.options.length > 1 && (
        <div className='mt-6'>
          <h2 className='text-sm font-bold uppercase tracking-wide text-ink-500'>
            Options
          </h2>
          <div className='mt-2 flex flex-wrap gap-2'>
            {post.options.map((option, i) => (
              <span
                key={i}
                className='rounded-lg bg-ink-100 px-3 py-1 text-xs font-medium text-ink-700'
              >
                {option}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions — masquées pour le showroom Tunisian Cars */}
      {!hideSimilar && post.similar && post.similar.length > 0 && (
        <section className='mt-12 border-t border-ink-100 pt-8'>
          <h2 className='mb-6 text-xl font-extrabold tracking-tight'>
            Véhicules similaires
          </h2>
          <ShowroomCars posts={post.similar} />
        </section>
      )}
    </article>
  )
}

/**
 * Renders a listing detail. On the full page it receives the already-fetched
 * `post` (SSR). In the modal it receives only `postId` and fetches on the
 * client — so the modal opens instantly and shows a loading skeleton while the
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
