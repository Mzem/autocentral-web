'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMotorcycle } from '@fortawesome/free-solid-svg-icons'
import { Region } from '../../../api/services/regions.service'
import { useMerchantKey } from '../../_lib/useMerchantKey'
import ImagesEditor from './ImagesEditor'

const inputCls =
  'mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500'
const labelCls = 'text-xs font-medium text-ink-500'

export default function NewMotoForm({ regions }: { regions: Region[] }) {
  const { key, ready } = useMerchantKey()
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [form, setForm] = useState({
    title: '',
    make: '',
    model: '',
    regionId: '',
    phone: '',
    year: '',
    km: '',
    cc: '',
    price: '',
    description: ''
  })

  useEffect(() => {
    if (ready && !key) router.replace('/login')
  }, [ready, key, router])

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) return alert('Ajoutez au moins une photo')
    if (!key) return
    setBusy(true)
    try {
      const fd = new FormData()
      files.forEach((f) => fd.append('files', f))
      fd.append('authKey', key)
      if (form.title) fd.append('title', form.title)
      if (form.make) fd.append('make', form.make)
      if (form.model) fd.append('model', form.model)
      if (form.regionId) fd.append('regionId', form.regionId)
      if (form.phone) fd.append('phone', form.phone)
      if (form.year) fd.append('year', form.year)
      if (form.km) fd.append('km', form.km)
      if (form.cc) fd.append('cc', form.cc)
      if (form.price) fd.append('price', form.price)
      if (form.description) fd.append('description', form.description)

      const res = await fetch('/api/moto-post', { method: 'POST', body: fd })
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

  return (
    <form onSubmit={submit} className='w-full text-ink-950'>
      <h1 className='flex items-center gap-2 text-xl font-extrabold'>
        <FontAwesomeIcon
          icon={faMotorcycle}
          className='h-5 w-5 text-brand-500'
        />
        Nouvelle moto
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
        <label className='block'>
          <span className={labelCls}>Marque</span>
          <input
            value={form.make}
            onChange={(e) => set('make', e.target.value)}
            className={inputCls}
          />
        </label>
        <label className='block'>
          <span className={labelCls}>Modèle</span>
          <input
            value={form.model}
            onChange={(e) => set('model', e.target.value)}
            className={inputCls}
          />
        </label>
        <label className='block'>
          <span className={labelCls}>Année</span>
          <input
            type='number'
            value={form.year}
            onChange={(e) => set('year', e.target.value)}
            className={inputCls}
          />
        </label>
        <label className='block'>
          <span className={labelCls}>Kilométrage</span>
          <input
            type='number'
            value={form.km}
            onChange={(e) => set('km', e.target.value)}
            className={inputCls}
          />
        </label>
        <label className='block'>
          <span className={labelCls}>Cylindrée (cc)</span>
          <input
            type='number'
            placeholder='ex. 600'
            value={form.cc}
            onChange={(e) => set('cc', e.target.value)}
            className={inputCls}
          />
        </label>
        <label className='block'>
          <span className={labelCls}>Prix (DT) - vide = N.C.</span>
          <input
            type='number'
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
            className={inputCls}
          />
        </label>
        <label className='block'>
          <span className={labelCls}>Région</span>
          <select
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
          <span className={labelCls}>Téléphone (8 chiffres)</span>
          <input
            type='number'
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            className={inputCls}
          />
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
          <span className={labelCls}>Photos (max 10)</span>
          <div className='mt-1'>
            <ImagesEditor max={10} onChange={setFiles} />
          </div>
        </div>
      </div>

      <button
        type='submit'
        disabled={busy}
        className='mt-6 w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60'
      >
        {busy ? 'Publication…' : 'Publier la moto'}
      </button>
    </form>
  )
}
