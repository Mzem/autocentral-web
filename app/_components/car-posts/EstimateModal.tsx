'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark,
  faCalculator,
  faChartLine
} from '@fortawesome/free-solid-svg-icons'
import {
  CarPostListItem,
  CarPriceEstimate,
  generateCarPostsQueryParams
} from '../../../api/services/car-posts.service'
import { carModels, Fuel, fuelLabel } from '../../types'
import { dotNumber } from '../../helpers'
import CarPostCard from './CarPostCard'

const inputCls =
  'mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-950 outline-none focus:border-brand-500'
const labelCls = 'text-xs font-medium text-ink-500'

export default function EstimateModal() {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [estimate, setEstimate] = useState<CarPriceEstimate | null>(null)
  const [similar, setSimilar] = useState<CarPostListItem[]>([])

  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [km, setKm] = useState('')
  const [cv, setCv] = useState('')
  const [fuel, setFuel] = useState('')
  const [gearbox, setGearbox] = useState('')
  const [firstOwner, setFirstOwner] = useState(false)
  const [fullOptions, setFullOptions] = useState(false)
  const [specialVersion, setSpecialVersion] = useState(false)

  const models = carModels.find((c) => c.make === make)?.models ?? []

  const reset = () => {
    setEstimate(null)
    setSimilar([])
  }

  const close = () => {
    setOpen(false)
    reset()
  }

  const run = async () => {
    if (!make || !model || !year || !km || !cv) {
      alert(
        'Renseignez au moins la marque, le modèle, l’année, le km et les CV.'
      )
      return
    }
    setBusy(true)
    reset()
    try {
      // Go through the Next proxy route (the API key lives server-side).
      const params = new URLSearchParams({ make, model, year, km, cv })
      if (fuel) params.set('fuel', fuel)
      if (gearbox) params.set('gearbox', gearbox)
      if (firstOwner) params.set('firstOwner', 'true')
      if (fullOptions) params.set('fullOptions', 'true')
      if (specialVersion) params.set('specialVersion', 'true')
      const estRes = await fetch('/api/estimate?' + params.toString())
      const est: CarPriceEstimate = await estRes.json()
      setEstimate(est)

      // Comparable listings to browse. The API only filters by the text query
      // (make/model aren't standalone filters), so search "make model".
      const qp = generateCarPostsQueryParams({
        page: 1,
        q: `${make} ${model}`,
        minYear: Number(year) - 4,
        maxYear: Number(year) + 4
      })
      const res = await fetch('/api/car-posts/' + qp)
      const posts: CarPostListItem[] = await res.json()
      setSimilar(
        (Array.isArray(posts) ? posts : []).filter((p) => p.image).slice(0, 6)
      )
    } catch {
      setEstimate({ enough: false, sampleSize: 0 })
    } finally {
      setBusy(false)
    }
  }

  const field = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    type: 'text' | 'number' = 'text'
  ) => (
    <label className='block'>
      <span className={labelCls}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </label>
  )

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-colors hover:bg-brand-500'
      >
        <FontAwesomeIcon icon={faCalculator} className='h-4 w-4' />
        Estimer mon véhicule
      </button>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            // Below the annonce detail modal (z-60) so clicking a similar card
            // opens it on top while this estimate modal stays open behind.
            className='fixed inset-0 z-[50] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm'
            onClick={close}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className='relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-5 text-ink-950 shadow-2xl lg:p-6'
            >
              <button
                type='button'
                aria-label='Fermer'
                onClick={close}
                className='absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-ink-100 text-ink-600 hover:bg-ink-200'
              >
                <FontAwesomeIcon icon={faXmark} className='h-4 w-4' />
              </button>

              <h2 className='flex items-center gap-2 pr-10 text-lg font-extrabold'>
                <FontAwesomeIcon
                  icon={faChartLine}
                  className='h-5 w-5 text-brand-500'
                />
                Estimer mon véhicule
              </h2>
              <p className='mt-1 text-sm text-ink-500'>
                Estimation basée sur le prix médian des annonces comparables du
                marché.
              </p>

              <div className='mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2'>
                <label className='block'>
                  <span className={labelCls}>Marque</span>
                  <select
                    value={make}
                    onChange={(e) => {
                      setMake(e.target.value)
                      setModel('')
                    }}
                    className={inputCls}
                  >
                    <option value=''>- Choisir -</option>
                    {carModels.map((c) => (
                      <option key={c.make} value={c.make}>
                        {c.make}
                      </option>
                    ))}
                  </select>
                </label>
                <label className='block'>
                  <span className={labelCls}>Modèle</span>
                  <select
                    value={model}
                    disabled={!models.length}
                    onChange={(e) => setModel(e.target.value)}
                    className={inputCls}
                  >
                    <option value=''>- Choisir -</option>
                    {models.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>
                {field('Année', year, setYear, 'number')}
                {field('Kilométrage', km, setKm, 'number')}
                {field('Puissance (CV)', cv, setCv, 'number')}
                <label className='block'>
                  <span className={labelCls}>Carburant</span>
                  <select
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value)}
                    className={inputCls}
                  >
                    <option value=''>Indifférent</option>
                    {Object.values(Fuel).map((f) => (
                      <option key={f} value={f}>
                        {fuelLabel(f)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className='block'>
                  <span className={labelCls}>Boîte</span>
                  <select
                    value={gearbox}
                    onChange={(e) => setGearbox(e.target.value)}
                    className={inputCls}
                  >
                    <option value=''>Indifférent</option>
                    <option value='Automatique'>Automatique</option>
                    <option value='Manuelle'>Manuelle</option>
                  </select>
                </label>
                <label className='flex items-center gap-2 self-end pb-2 text-sm'>
                  <input
                    type='checkbox'
                    checked={firstOwner}
                    onChange={(e) => setFirstOwner(e.target.checked)}
                  />
                  Première main
                </label>
                <label className='flex items-center gap-2 self-end pb-2 text-sm'>
                  <input
                    type='checkbox'
                    checked={fullOptions}
                    onChange={(e) => setFullOptions(e.target.checked)}
                  />
                  Full options (AMG+, M Pro…)
                </label>
                <label className='flex items-center gap-2 self-end pb-2 text-sm'>
                  <input
                    type='checkbox'
                    checked={specialVersion}
                    onChange={(e) => setSpecialVersion(e.target.checked)}
                  />
                  Version spéciale (Coupé/Cabriolet…)
                </label>
              </div>

              <button
                type='button'
                onClick={run}
                disabled={busy}
                className='mt-5 w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60'
              >
                {busy ? 'Estimation…' : 'Estimer'}
              </button>

              {estimate && (
                <div className='mt-6 border-t border-ink-100 pt-5'>
                  {estimate.enough ? (
                    <div className='rounded-xl bg-brand-500/5 p-4 text-center ring-1 ring-brand-500/20'>
                      <p className={labelCls}>Fourchette estimée</p>
                      <p className='mt-1 text-2xl font-extrabold text-brand-600 lg:text-3xl'>
                        {dotNumber(estimate.low)} – {dotNumber(estimate.high)}{' '}
                        DT
                      </p>
                      <p className='mt-1 text-sm text-ink-500'>
                        Valeur médiane : {dotNumber(estimate.mid)} DT · basé sur{' '}
                        {estimate.sampleSize} annonces comparables
                      </p>
                    </div>
                  ) : (
                    <p className='rounded-xl bg-ink-50 p-4 text-center text-sm text-ink-600'>
                      Pas assez d&apos;annonces comparables pour estimer ce
                      véhicule de façon fiable
                      {estimate.sampleSize > 0
                        ? ` (${estimate.sampleSize} trouvée·s).`
                        : '.'}
                    </p>
                  )}

                  {similar.length > 0 && (
                    <div className='mt-5'>
                      <p className='mb-3 text-sm font-bold'>
                        Véhicules similaires
                      </p>
                      {/* Standard (non-admin) cards, 2 per row then 1; clicking
                          opens the detail modal on top (this modal stays open). */}
                      <ul className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        {similar.map((p) => (
                          <CarPostCard key={p.id} post={p} />
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
