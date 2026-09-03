'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowUp,
  faArrowUpRightFromSquare,
  faBarcode,
  faBuildingColumns,
  faCalendarDays,
  faChevronDown,
  faChevronUp,
  faCircleInfo,
  faFilePdf,
  faGaugeHigh,
  faLocationDot,
  faMagnifyingGlass,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import type { AuctionVehicle } from '../../../api/services/auctions.service'

const fmtDate = (iso: string | null): string | null => {
  if (!iso) return null
  const d = new Date(`${iso}T00:00:00`)
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
}

const daysLeft = (iso: string | null): number | null => {
  if (!iso) return null
  const end = new Date(`${iso}T00:00:00`).getTime()
  if (isNaN(end)) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((end - today.getTime()) / 86400000)
}

const tnd = (n: number): string => `${n.toLocaleString('fr-FR')} TND`

// Accent- and case-insensitive text for searching.
const norm = (s: string): string =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Clean card title: make + model from the API; a short notice head otherwise. */
const titleOf = (a: AuctionVehicle): string => {
  const make = a.make ?? ''
  let model = a.model ?? ''
  if (make && model.toLowerCase().startsWith(make.toLowerCase())) {
    model = model.slice(make.length).trim()
  }
  const decoded = [make, model].filter(Boolean).join(' ')
  if (decoded) return decoded
  const head = (a.description ?? '').split(/[,\-–(]/)[0].trim()
  return head ? head.slice(0, 60) : 'Véhicule'
}

function Row({
  icon,
  label,
  children
}: {
  icon: IconDefinition
  label: string
  children: React.ReactNode
}) {
  return (
    <div className='flex min-w-0 items-start gap-2.5'>
      <FontAwesomeIcon
        icon={icon}
        className='mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500'
      />
      <div className='min-w-0 flex-1'>
        <dt className='text-[0.6rem] font-semibold uppercase tracking-wide text-ink-400'>
          {label}
        </dt>
        <dd className='break-words text-sm text-ink-800'>{children}</dd>
      </div>
    </div>
  )
}

function AuctionCard({ a }: { a: AuctionVehicle }) {
  const [open, setOpen] = useState(false)
  const left = daysLeft(a.dernierDelai)
  const specs = [a.year, a.body, a.fuel].filter(Boolean).join(' · ')
  const location = [a.lieu, a.ville].filter(Boolean).join(' · ')
  const others = (a.decoded ?? []).slice(1)

  return (
    <li className='min-w-0 list-none'>
      <article className='flex h-full min-w-0 flex-col overflow-hidden rounded-lg bg-white shadow-card-light ring-1 ring-ink-100'>
        {/* Header band */}
        <div className='bg-ink-950 p-4 text-white'>
          <div className='flex flex-wrap items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-wider'>
            <span className='rounded bg-brand-500 px-2 py-0.5'>
              {a.source === 'jort' ? 'JORT' : 'Douane'}
            </span>
            {left !== null && left <= 3 && (
              <span className='rounded bg-red/80 px-2 py-0.5'>
                {left <= 0 ? "Aujourd'hui" : `J-${left}`}
              </span>
            )}
            <span className='ml-auto font-medium normal-case tracking-normal text-white/60'>
              Avis n° {a.avis ?? '—'} · Lot {a.lot ?? '—'}
            </span>
          </div>
          <h3 className='mt-2 break-words text-lg font-extrabold leading-tight'>
            {titleOf(a)}
          </h3>
          {specs && <p className='mt-0.5 text-sm text-white/70'>{specs}</p>}
        </div>

        {/* Price / deposit */}
        <div className='grid grid-cols-2 gap-3 border-b border-ink-100 p-4'>
          <div>
            <p className='text-[0.6rem] font-semibold uppercase tracking-wide text-ink-400'>
              Mise à prix
            </p>
            <p className='mt-0.5 text-xl font-extrabold text-brand-600'>
              {a.miseAPrix && a.miseAPrix > 0
                ? tnd(a.miseAPrix)
                : 'Meilleure offre'}
            </p>
          </div>
          <div className='text-right'>
            <p className='text-[0.6rem] font-semibold uppercase tracking-wide text-ink-400'>
              Caution
            </p>
            <p className='mt-0.5 text-lg font-bold text-ink-800'>
              {a.caution !== null ? tnd(a.caution) : '—'}
            </p>
          </div>
        </div>

        {/* Details */}
        <dl className='space-y-3 p-4'>
          {location && (
            <Row icon={faLocationDot} label='Lieu de dépôt'>
              {location}
            </Row>
          )}
          {a.organisme && (
            <Row icon={faBuildingColumns} label='Organisme'>
              {a.organisme}
            </Row>
          )}
          <Row icon={faCalendarDays} label='Dernier délai'>
            <span className='font-semibold'>
              {fmtDate(a.dernierDelai) ?? '—'}
            </span>
            {left !== null && (
              <span className='ml-2 text-xs text-ink-500'>
                {left <= 0 ? "(aujourd'hui)" : `(dans ${left} j)`}
              </span>
            )}
            {a.datePublication && (
              <span className='block text-xs text-ink-500'>
                Publié le {fmtDate(a.datePublication)}
              </span>
            )}
          </Row>
          {(a.engine || a.country || a.extra) && (
            <Row icon={faGaugeHigh} label='Fiche véhicule (VIN décodé)'>
              {[a.engine, a.country ? `Fabriqué : ${a.country}` : null]
                .filter(Boolean)
                .join(' · ')}
              {a.extra && (
                <span className='block text-xs text-ink-600'>{a.extra}</span>
              )}
            </Row>
          )}
          {a.vins.length > 0 && (
            <Row icon={faBarcode} label='VIN'>
              <div className='flex flex-wrap gap-1'>
                {a.vins.map((v) => (
                  <code
                    key={v}
                    className='rounded bg-ink-50 px-1.5 py-0.5 font-mono text-[0.7rem] text-ink-700'
                  >
                    {v}
                  </code>
                ))}
              </div>
            </Row>
          )}
          {others.length > 0 && (
            <Row icon={faCircleInfo} label='Autres véhicules du lot'>
              <ul className='space-y-0.5 text-xs text-ink-600'>
                {others.map((o) => (
                  <li key={o.vin}>
                    {[o.make, o.model, o.year].filter(Boolean).join(' ') ||
                      o.vin}
                  </li>
                ))}
              </ul>
            </Row>
          )}
        </dl>

        {/* Official notice text: folded by default (it is long and raw). */}
        {a.description && (
          <div className='px-4'>
            <p
              className={`whitespace-pre-line break-words text-xs leading-relaxed text-ink-600 ${
                open ? '' : 'line-clamp-3'
              }`}
            >
              {a.description}
            </p>
            <button
              type='button'
              onClick={() => setOpen((v) => !v)}
              className='mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-500'
            >
              <FontAwesomeIcon
                icon={open ? faChevronUp : faChevronDown}
                className='h-3 w-3'
              />
              {open ? 'Réduire' : "Texte complet de l'avis"}
            </button>
          </div>
        )}

        {/* Links */}
        <div className='mt-auto flex flex-wrap gap-2 p-4'>
          {a.sourceUrl && (
            <a
              href={a.sourceUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-600'
            >
              <FontAwesomeIcon icon={faFilePdf} className='h-3.5 w-3.5' />
              Avis officiel (PDF)
            </a>
          )}
          {a.detailUrl && (
            <a
              href={a.detailUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3.5 py-2 text-xs font-semibold text-ink-700 transition-colors hover:bg-ink-50'
            >
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className='h-3 w-3'
              />
              encheres.tn
            </a>
          )}
        </div>
      </article>
    </li>
  )
}

/**
 * Auction list with a free-text search (client-side, accent/case-insensitive,
 * every word must match) and a "back to top" arrow once the search bar has
 * scrolled out of view - same behaviour as the car search engine.
 */
export default function EncheresList({ items }: { items: AuctionVehicle[] }) {
  const [q, setQ] = useState('')
  const [showTop, setShowTop] = useState(false)
  const searchRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = searchRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(([entry]) =>
      setShowTop(!entry.isIntersecting)
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const filtered = useMemo(() => {
    const tokens = norm(q).split(/\s+/).filter(Boolean)
    if (tokens.length === 0) return items
    return items.filter((a) => {
      const hay = norm(
        [
          titleOf(a),
          a.make,
          a.model,
          a.year,
          a.fuel,
          a.body,
          a.engine,
          a.country,
          a.ville,
          a.lieu,
          a.organisme,
          a.avis,
          a.lot,
          a.source,
          a.description,
          ...a.vins
        ]
          .filter((v) => v !== null && v !== undefined && v !== '')
          .join(' ')
      )
      return tokens.every((t) => hay.includes(t))
    })
  }, [items, q])

  return (
    <>
      {/* Search */}
      <div ref={searchRef} className='mt-8'>
        <label className='relative block'>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className='pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400'
          />
          <input
            type='search'
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='Rechercher : marque, modèle, ville, VIN, avis…'
            className='w-full rounded-xl border border-ink-200 bg-white py-3 pl-11 pr-11 text-sm text-ink-950 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500'
          />
          {q && (
            <button
              type='button'
              aria-label='Effacer'
              onClick={() => setQ('')}
              className='absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-500 hover:bg-ink-100'
            >
              <FontAwesomeIcon icon={faXmark} className='h-3.5 w-3.5' />
            </button>
          )}
        </label>
        <p className='mt-2 text-xs text-ink-500'>
          {filtered.length} enchère{filtered.length > 1 ? 's' : ''} en cours
          {q ? ` pour « ${q} »` : ''}
        </p>
      </div>

      {items.length === 0 ? (
        <p className='mt-8 rounded-2xl bg-ink-50 px-6 py-14 text-center text-sm text-ink-500'>
          Aucune enchère véhicule en cours pour le moment — revenez bientôt.
        </p>
      ) : filtered.length === 0 ? (
        <p className='mt-8 rounded-2xl bg-ink-50 px-6 py-14 text-center text-sm text-ink-500'>
          Aucun résultat pour « {q} ».
        </p>
      ) : (
        <ul className='mt-6 grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filtered.map((a) => (
            <AuctionCard key={a.id} a={a} />
          ))}
        </ul>
      )}

      {/* Back to top (once the search bar is out of view) */}
      {showTop && (
        <button
          type='button'
          aria-label='Remonter en haut'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className='fixed bottom-6 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/30 transition-colors hover:bg-brand-600'
        >
          <FontAwesomeIcon icon={faArrowUp} className='h-5 w-5' />
        </button>
      )}
    </>
  )
}
