'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCarSide } from '@fortawesome/free-solid-svg-icons'
import { Region } from '../../../api/services/regions.service'
import { CarMake } from '../../../api/services/car-makes.service'
import {
  CarModelsByMake,
  ModelListItem
} from '../../../api/services/car-model.service'
import { Color, Fuel, fuelLabel } from '../../types'
import { useMerchantKey } from '../../_lib/useMerchantKey'
import ImagesEditor from './ImagesEditor'

const GEARBOXES = ['Automatique', 'Manuelle']
// Engine displacement: single digit, dot, single digit (e.g. "2.0").
const CYLINDER_RE = /^\d\.\d$/
const inputCls =
  'mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500'
const labelCls = 'text-xs font-medium text-ink-500'

export default function NewCarForm({
  regions,
  makes,
  merchantId
}: {
  regions: Region[]
  makes: CarMake[]
  merchantId: string
}) {
  const { key, ready } = useMerchantKey()
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  // Engine cascade: make → model → year → engine
  const [makeId, setMakeId] = useState('')
  const [catalog, setCatalog] = useState<CarModelsByMake | null>(null)
  const [modelName, setModelName] = useState('')
  const [carYear, setCarYear] = useState('') // engine catalog year
  const [carEngineId, setCarEngineId] = useState('')

  const [form, setForm] = useState({
    title: '',
    regionId: '',
    km: '',
    year: '',
    cv: '',
    cylinder: '',
    price: '',
    fuel: Fuel.ESSENCE as string,
    color: Color.BLACK as string,
    gearbox: GEARBOXES[0],
    description: '',
    isFeatured: false
  })

  useEffect(() => {
    if (ready && !key) router.replace('/login')
  }, [ready, key, router])

  useEffect(() => {
    setCatalog(null)
    setModelName('')
    setCarYear('')
    setCarEngineId('')
    if (!makeId) return
    let cancelled = false
    fetch(`/api/car-models?makeId=${encodeURIComponent(makeId)}`)
      .then((r) => r.json())
      .then((data: CarModelsByMake) => {
        if (!cancelled) setCatalog(data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [makeId])

  const models: ModelListItem[] = catalog?.models ?? []
  const selectedModel = models.find((m) => m.modelName === modelName)
  const years = selectedModel?.modelYears ?? []
  // The catalog year arrives as a number; the <select> value is always a
  // string, so compare loosely (coerced) or the engines never populate.
  const engines = years.find((y) => String(y.year) === carYear)?.engines ?? []

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!carEngineId) return alert('Sélectionnez la motorisation')
    if (files.length === 0) return alert('Ajoutez au moins une photo')
    const cylinder = form.cylinder.trim()
    if (cylinder && !CYLINDER_RE.test(cylinder))
      return alert('Cylindrée invalide : le format doit être x.x (ex. 2.0)')
    if (!key) return
    setBusy(true)
    try {
      const fd = new FormData()
      // Order matters: the first file becomes the main thumbnail.
      files.forEach((f) => fd.append('files', f))
      fd.append('authKey', key)
      fd.append('merchantId', merchantId)
      fd.append('regionId', form.regionId)
      fd.append('carEngineId', carEngineId)
      fd.append('title', form.title)
      if (form.description) fd.append('description', form.description)
      fd.append('km', form.km)
      fd.append('year', form.year)
      fd.append('cv', form.cv)
      if (cylinder) fd.append('cylinder', cylinder)
      if (form.price) fd.append('price', form.price)
      fd.append('fuel', form.fuel)
      fd.append('color', form.color)
      fd.append('gearbox', form.gearbox)
      fd.append('isFeatured', form.isFeatured ? 'true' : 'false')

      const res = await fetch('/api/car-post', { method: 'POST', body: fd })
      if (!res.ok) {
        let msg = `Erreur ${res.status}`
        try {
          const d = await res.json()
          if (d?.error) msg = d.error
        } catch {
          // keep default
        }
        throw new Error(msg)
      }
      router.push('/')
      router.refresh()
    } catch (err) {
      alert(`Échec de l'ajout : ${(err as Error).message}`)
    } finally {
      setBusy(false)
    }
  }

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }))

  return (
    <form onSubmit={submit} className='w-full text-ink-950'>
      <h1 className='flex items-center gap-2 text-xl font-extrabold'>
        <FontAwesomeIcon icon={faCarSide} className='h-5 w-5 text-brand-500' />
        Nouveau véhicule
      </h1>

      <div className='mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <label className='block sm:col-span-2'>
          <span className={labelCls}>Titre de l&apos;annonce</span>
          <input
            required
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            className={inputCls}
          />
        </label>

        {/* Cascade */}
        <label className='block'>
          <span className={labelCls}>Marque</span>
          <select
            required
            value={makeId}
            onChange={(e) => setMakeId(e.target.value)}
            className={inputCls}
          >
            <option value=''>- Choisir -</option>
            {makes.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <label className='block'>
          <span className={labelCls}>Modèle</span>
          <select
            required
            value={modelName}
            disabled={!models.length}
            onChange={(e) => {
              setModelName(e.target.value)
              setCarYear('')
              setCarEngineId('')
              set('cylinder', '')
            }}
            className={inputCls}
          >
            <option value=''>- Choisir -</option>
            {models.map((m) => (
              <option key={m.modelName} value={m.modelName}>
                {m.modelName}
              </option>
            ))}
          </select>
        </label>
        <label className='block'>
          <span className={labelCls}>Génération (année du modèle)</span>
          <select
            required
            value={carYear}
            disabled={!years.length}
            onChange={(e) => {
              setCarYear(e.target.value)
              setCarEngineId('')
              set('cylinder', '')
            }}
            className={inputCls}
          >
            <option value=''>- Choisir -</option>
            {years.map((y) => (
              <option key={y.year} value={y.year}>
                {y.year}
              </option>
            ))}
          </select>
        </label>
        <label className='block'>
          <span className={labelCls}>Motorisation</span>
          <select
            required
            value={carEngineId}
            disabled={!engines.length}
            onChange={(e) => {
              const id = e.target.value
              setCarEngineId(id)
              // Auto-fill the displacement from the chosen engine (hybrids /
              // electrics often have none in the catalog → left blank to type).
              const eng = engines.find((x) => x.id === id)
              set('cylinder', eng?.cylinder ?? '')
            }}
            className={inputCls}
          >
            <option value=''>- Choisir -</option>
            {engines.map((eng) => (
              <option key={eng.id} value={eng.id}>
                {[
                  eng.engineName,
                  eng.cylinder,
                  fuelLabel(eng.fuel),
                  eng.hp && `${eng.hp}ch`
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </option>
            ))}
          </select>
        </label>

        <label className='block'>
          <span className={labelCls}>Région</span>
          <select
            required
            value={form.regionId}
            onChange={(e) => set('regionId', e.target.value)}
            className={inputCls}
          >
            <option value=''>- Choisir -</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <label className='block'>
          <span className={labelCls}>Année de 1ʳᵉ mise en circulation</span>
          <input
            required
            type='number'
            min={1950}
            value={form.year}
            onChange={(e) => set('year', e.target.value)}
            className={inputCls}
          />
        </label>
        <label className='block'>
          <span className={labelCls}>Kilométrage</span>
          <input
            required
            type='number'
            value={form.km}
            onChange={(e) => set('km', e.target.value)}
            className={inputCls}
          />
        </label>
        <label className='block'>
          <span className={labelCls}>Puissance (CV)</span>
          <input
            required
            type='number'
            min={2}
            max={99}
            value={form.cv}
            onChange={(e) => set('cv', e.target.value)}
            className={inputCls}
          />
        </label>
        <label className='block'>
          <span className={labelCls}>Cylindrée (L)</span>
          <input
            type='text'
            inputMode='decimal'
            placeholder='ex. 2.0'
            value={form.cylinder}
            onChange={(e) => set('cylinder', e.target.value)}
            className={inputCls}
          />
          <span className='mt-0.5 block text-[0.65rem] text-ink-400'>
            Auto-remplie selon la motorisation ; format x.x (ex. 2.0)
          </span>
        </label>
        <label className='block'>
          <span className={labelCls}>Prix (DT)</span>
          <input
            type='number'
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
            className={inputCls}
          />
        </label>

        <label className='block'>
          <span className={labelCls}>Carburant</span>
          <select
            value={form.fuel}
            onChange={(e) => set('fuel', e.target.value)}
            className={inputCls}
          >
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
            value={form.gearbox}
            onChange={(e) => set('gearbox', e.target.value)}
            className={inputCls}
          >
            {GEARBOXES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
        <label className='block'>
          <span className={labelCls}>Couleur</span>
          <select
            value={form.color}
            onChange={(e) => set('color', e.target.value)}
            className={inputCls}
          >
            {Object.values(Color).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className='block sm:col-span-2'>
          <span className={labelCls}>Description</span>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            className={inputCls}
          />
        </label>

        <div className='block sm:col-span-2'>
          <span className={labelCls}>Photos (max 20)</span>
          <div className='mt-1'>
            <ImagesEditor max={20} onChange={setFiles} />
          </div>
        </div>

        <label className='flex items-center gap-2 text-sm sm:col-span-2'>
          <input
            type='checkbox'
            checked={form.isFeatured}
            onChange={(e) => set('isFeatured', e.target.checked)}
          />
          Mettre en avant (à la une)
        </label>
      </div>

      <button
        type='submit'
        disabled={busy}
        className='mt-6 w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60'
      >
        {busy ? 'Publication…' : 'Publier le véhicule'}
      </button>
    </form>
  )
}
