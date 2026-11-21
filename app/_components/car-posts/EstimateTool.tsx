'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalculator,
  faChartLine,
  faCheck,
  faShareNodes,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import {
  CarPostListItem,
  CarPriceEstimate,
  generateCarPostsQueryParams
} from '../../../api/services/car-posts.service'
import { carModels, Fuel, fuelLabel } from '../../types'
import { dotNumber } from '../../helpers'
import {
  estimateCarLabel,
  estimateQueryString,
  estimationPath,
  isCompleteEstimate,
  type EstimateParams
} from '../../_lib/estimate'
import { AC_URL } from '../../_lib/site'
import CarPostCard from './CarPostCard'

/** A listing's make / model in the select's own spelling when it has one
 *  (case-insensitive), else kept as is (added as an extra option). */
function canonical(value: string | undefined, options: string[]): string {
  const v = (value ?? '').trim()
  if (!v) return ''
  return options.find((o) => o.toLowerCase() === v.toLowerCase()) ?? v
}

// `focus:!rounded-lg` / `focus:ring-0`: legacy global rules square the inputs
// on focus and the forms plugin adds its own blue ring.
const inputCls =
  'mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-950 outline-none transition-colors focus:!rounded-lg focus:border-brand-500 focus:ring-0 disabled:bg-ink-100 disabled:text-ink-400'
const labelCls = 'text-xs font-semibold text-ink-600'
const checkCls = 'flex items-center gap-2 text-sm text-ink-800'

/**
 * Price estimate of a vehicle (the `/estimation` page): a form, then the
 * estimated range - the median price of comparable listings - and a few of
 * those listings to browse. Each card opens the usual detail modal on top, the
 * estimate staying in place underneath.
 *
 * `initial` comes from the URL (/estimation?make=…): the "Estimer" button of a
 * listing or a shared estimate. The form is pre-filled and, when complete, the
 * estimate runs straight away. The URL always mirrors the last estimate, so it
 * can be shared ("Partager mon estimation") and reopens the same result.
 */
export default function EstimateTool({
  initial = {}
}: {
  initial?: EstimateParams
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [estimate, setEstimate] = useState<CarPriceEstimate | null>(null)
  const [similar, setSimilar] = useState<CarPostListItem[]>([])
  const resultRef = useRef<HTMLDivElement | null>(null)

  const initialMake = canonical(
    initial.make,
    carModels.map((c) => c.make)
  )
  const [make, setMake] = useState(initialMake)
  const [model, setModel] = useState(
    canonical(
      initial.model,
      carModels.find((c) => c.make === initialMake)?.models ?? []
    )
  )
  const [year, setYear] = useState(initial.year ?? '')
  const [km, setKm] = useState(initial.km ?? '')
  const [cv, setCv] = useState(initial.cv ?? '')
  const [fuel, setFuel] = useState(initial.fuel ?? '')
  const [gearbox, setGearbox] = useState(initial.gearbox ?? '')
  const [firstOwner, setFirstOwner] = useState(!!initial.firstOwner)
  const [fullOptions, setFullOptions] = useState(!!initial.fullOptions)
  const [specialVersion, setSpecialVersion] = useState(!!initial.specialVersion)
  // The parameters of the estimate on screen (what "Partager" shares).
  const [shown, setShown] = useState<EstimateParams | null>(null)
  const [shared, setShared] = useState(false)

  // A make / model / fuel from a listing may be missing from the lists: keep
  // it selectable rather than silently dropping it.
  const listedMakes = carModels.map((c) => c.make)
  const makes =
    make && !listedMakes.includes(make) ? [make, ...listedMakes] : listedMakes
  const listedModels = carModels.find((c) => c.make === make)?.models ?? []
  const models =
    model && !listedModels.includes(model)
      ? [model, ...listedModels]
      : listedModels
  const listedFuels: string[] = Object.values(Fuel)
  const fuels =
    fuel && !listedFuels.includes(fuel) ? [...listedFuels, fuel] : listedFuels

  const current = (): EstimateParams => ({
    make,
    model,
    year,
    km,
    cv,
    fuel,
    gearbox,
    firstOwner,
    fullOptions,
    specialVersion
  })

  const runWith = async (p: EstimateParams) => {
    if (!isCompleteEstimate(p)) {
      setError(
        'Renseignez au moins la marque, le modèle, l’année, le kilométrage et la puissance.'
      )
      return
    }
    setError(null)
    setBusy(true)
    setEstimate(null)
    setSimilar([])
    setShared(false)
    // The URL mirrors the estimate: shareable, and reopens the same result.
    window.history.replaceState(null, '', estimationPath(p))
    try {
      // Go through the Next proxy route (the API key lives server-side).
      const estRes = await fetch('/api/estimate?' + estimateQueryString(p))
      const est: CarPriceEstimate = await estRes.json()
      setEstimate(est)
      setShown(p)

      // Comparable listings to browse. The API only filters by the text query
      // (make/model aren't standalone filters), so search "make model".
      const qp = generateCarPostsQueryParams({
        page: 1,
        q: `${p.make} ${p.model}`,
        minYear: Number(p.year) - 4,
        maxYear: Number(p.year) + 4
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
      // Bring the result into view (it sits below the form on phones).
      requestAnimationFrame(() =>
        resultRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      )
    }
  }

  const run = (e: FormEvent) => {
    e.preventDefault()
    runWith(current())
  }

  // Opened from a listing / a shared link: show the result straight away
  // (incomplete listing: the form is pre-filled, the visitor completes it).
  const autoRan = useRef(false)
  useEffect(() => {
    if (autoRan.current) return
    autoRan.current = true
    if (isCompleteEstimate(initial)) runWith(current())
    else if (initial.make || initial.model) {
      setError(
        'Complétez les champs manquants (année, kilométrage, puissance…) puis lancez l’estimation.'
      )
    }
    // Runs once, on mount only (later estimates come from the form).
  }, [])

  // Share the estimate's URL (it recomputes the range AND the comparable cars
  // on opening, with a preview image): native share sheet on phones
  // (WhatsApp, Messenger…), else copy the link.
  const share = async () => {
    if (!shown || !estimate) return
    const url = `${AC_URL}${estimationPath(shown)}`
    const text = estimate.enough
      ? `Estimation ${estimateCarLabel(shown)} : ${dotNumber(
          estimate.low
        )} – ${dotNumber(estimate.high)} DT (Autocentral)`
      : `Estimation ${estimateCarLabel(shown)} sur Autocentral`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Mon estimation', text, url })
        return
      }
      await navigator.clipboard.writeText(`${text}\n${url}`)
      setShared(true)
    } catch {
      // Share sheet dismissed: nothing to do.
    }
  }

  const field = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    placeholder: string
  ) => (
    <label className='block'>
      <span className={labelCls}>{label}</span>
      <input
        type='number'
        inputMode='numeric'
        min={0}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </label>
  )

  return (
    <>
      <form
        onSubmit={run}
        noValidate
        className='mt-8 rounded-2xl bg-ink-50 p-4 ring-1 ring-ink-100 lg:p-6'
      >
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 lg:gap-4'>
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
              {makes.map((m) => (
                <option key={m} value={m}>
                  {m}
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
          {field('Année', year, setYear, 'ex. 2018')}
          {field('Kilométrage', km, setKm, 'ex. 120000')}
          {field('Puissance (CV)', cv, setCv, 'ex. 7')}
          <label className='block'>
            <span className={labelCls}>Carburant</span>
            <select
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              className={inputCls}
            >
              <option value=''>Indifférent</option>
              {fuels.map((f) => (
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
        </div>

        <div className='mt-4 flex flex-col gap-2.5 md:flex-row md:flex-wrap md:gap-x-6'>
          <label className={checkCls}>
            <input
              type='checkbox'
              checked={firstOwner}
              onChange={(e) => setFirstOwner(e.target.checked)}
            />
            Première main
          </label>
          <label className={checkCls}>
            <input
              type='checkbox'
              checked={fullOptions}
              onChange={(e) => setFullOptions(e.target.checked)}
            />
            Full options (AMG+, M Pro…)
          </label>
          <label className={checkCls}>
            <input
              type='checkbox'
              checked={specialVersion}
              onChange={(e) => setSpecialVersion(e.target.checked)}
            />
            Version spéciale (Coupé/Cabriolet…)
          </label>
        </div>

        {error && (
          <p role='alert' className='mt-4 text-sm font-medium text-danger'>
            {error}
          </p>
        )}

        <button
          type='submit'
          disabled={busy}
          className='mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto'
        >
          <FontAwesomeIcon
            icon={busy ? faSpinner : faCalculator}
            className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`}
          />
          {busy ? 'Estimation…' : 'Estimer'}
        </button>
      </form>

      <div ref={resultRef} className='scroll-mt-20'>
        {estimate && (
          <div className='mt-6'>
            {estimate.enough ? (
              <div className='rounded-2xl bg-brand-500/5 p-5 text-center ring-1 ring-brand-500/20 lg:p-8'>
                <p className='inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ink-500'>
                  <FontAwesomeIcon
                    icon={faChartLine}
                    className='h-4 w-4 text-brand-500'
                  />
                  Fourchette estimée
                </p>
                <p className='mt-2 text-3xl font-extrabold text-brand-500 lg:text-4xl'>
                  {dotNumber(estimate.low)} – {dotNumber(estimate.high)} DT
                </p>
                <p className='mt-2 text-sm text-ink-500'>
                  Valeur médiane : {dotNumber(estimate.mid)} DT · basé sur{' '}
                  {estimate.sampleSize} annonces comparables
                </p>
                {shown && (
                  <p className='mt-1 text-xs text-ink-400'>
                    {estimateCarLabel(shown)}
                  </p>
                )}
                <button
                  type='button'
                  onClick={share}
                  className='mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink-900 shadow ring-1 ring-ink-200 transition-colors hover:bg-ink-50'
                >
                  <FontAwesomeIcon
                    icon={shared ? faCheck : faShareNodes}
                    className='h-4 w-4 text-brand-500'
                  />
                  {shared ? 'Lien copié !' : 'Partager mon estimation'}
                </button>
              </div>
            ) : (
              <p className='rounded-2xl bg-ink-50 p-5 text-center text-sm text-ink-600 lg:p-8'>
                Pas assez d&apos;annonces comparables pour estimer ce véhicule
                de façon fiable
                {estimate.sampleSize > 0
                  ? ` (${estimate.sampleSize} trouvée·s).`
                  : '.'}
              </p>
            )}

            {similar.length > 0 && (
              <div className='mt-8'>
                <h2 className='mb-4 text-xl font-extrabold tracking-tight'>
                  Véhicules similaires
                </h2>
                {/* Standard cards; clicking one opens the detail modal on top
                    (the estimate stays underneath). */}
                <ul className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {similar.map((p) => (
                    <CarPostCard key={p.id} post={p} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
