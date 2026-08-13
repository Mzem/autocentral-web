'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import {
  faScrewdriverWrench,
  faPlus,
  faSpinner,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import { RealisationItem } from '../../../api/services/realisations.service'
import { useMerchantKey } from '../../_lib/useMerchantKey'
import RealisationCard from './RealisationCard'
import ImagesEditor from './ImagesEditor'

const inputCls =
  'mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500'
const labelCls = 'text-xs font-medium text-ink-500'
// After a sync the button stays greyed ~15 min (the IG scrape + import runs in
// the background); tracked per-device in localStorage with a live countdown.
const SCRAP_COOLDOWN_MS = 15 * 60 * 1000
const SCRAP_STORAGE_KEY = 'tc_ig_sync_until'

/**
 * Atelier "Nos réalisations récentes" section. Public gets the server-rendered
 * (hidden-free) list; an admin refetches including hidden ones and gets buttons
 * to add one manually or scrape @tunisiancarsgarage.
 */
export default function RealisationsSection({
  initialItems
}: {
  initialItems: RealisationItem[]
}) {
  const { key, ready } = useMerchantKey()
  const router = useRouter()
  const [items, setItems] = useState<RealisationItem[]>(initialItems)
  const [adding, setAdding] = useState(false)
  const [busy, setBusy] = useState(false)
  const [scraping, setScraping] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [form, setForm] = useState({ title: '', description: '' })
  const [until, setUntil] = useState(0)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    setUntil(Number(window.localStorage.getItem(SCRAP_STORAGE_KEY) || 0))
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!ready) return
    if (!key) {
      setItems(initialItems)
      return
    }
    let cancelled = false
    fetch('/api/admin/realisations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authKey: key })
    })
      .then((r) => r.json())
      .then((data: RealisationItem[]) => {
        if (!cancelled) setItems(Array.isArray(data) ? data : initialItems)
      })
      .catch(() => {
        if (!cancelled) setItems(initialItems)
      })
    return () => {
      cancelled = true
    }
  }, [ready, key, initialItems])

  // Public with nothing to show: hide the whole section.
  if (items.length === 0 && !key) return null

  const remaining = Math.max(0, until - now)
  const onCooldown = remaining > 0
  const cdMins = Math.floor(remaining / 60000)
  const cdSecs = Math.floor((remaining % 60000) / 1000)

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!key) return
    if (files.length === 0) return alert('Ajoutez au moins une photo')
    setBusy(true)
    try {
      const fd = new FormData()
      files.forEach((f) => fd.append('files', f))
      fd.append('authKey', key)
      if (form.title) fd.append('title', form.title)
      if (form.description) fd.append('description', form.description)
      const res = await fetch('/api/realisation', { method: 'POST', body: fd })
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
      setAdding(false)
      setForm({ title: '', description: '' })
      setFiles([])
      router.refresh()
    } catch (err) {
      alert(`Échec de l'ajout : ${(err as Error).message}`)
    } finally {
      setBusy(false)
    }
  }

  const scrap = async () => {
    if (!key || onCooldown) return
    setScraping(true)
    try {
      const res = await fetch('/api/realisation/scrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authKey: key })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? `Erreur ${res.status}`)
      const u = Date.now() + SCRAP_COOLDOWN_MS
      window.localStorage.setItem(SCRAP_STORAGE_KEY, String(u))
      setUntil(u)
      alert(
        'Sync Instagram lancée en arrière-plan. Les réalisations apparaîtront dans quelques minutes — rafraîchis la page.'
      )
    } catch (err) {
      alert(`Échec du scrap : ${(err as Error).message}`)
    } finally {
      setScraping(false)
    }
  }

  return (
    <section className='bg-white text-ink-950'>
      <div className='mx-auto w-[92%] xl:max-w-6xl pb-10 lg:pb-20'>
        <div className='flex flex-wrap items-end justify-between gap-3'>
          <div className='max-w-2xl'>
            <p className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500'>
              <FontAwesomeIcon icon={faScrewdriverWrench} className='h-4 w-4' />
              Le garage en action
            </p>
            <h2 className='mt-3 text-3xl font-extrabold tracking-tight lg:text-4xl'>
              Nos réalisations récentes
            </h2>
          </div>

          {key && (
            <div className='flex flex-wrap gap-2'>
              <button
                type='button'
                onClick={() => setAdding(true)}
                className='inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600'
              >
                <FontAwesomeIcon icon={faPlus} className='h-4 w-4' />
                Ajouter
              </button>
              <button
                type='button'
                onClick={scrap}
                disabled={scraping || onCooldown}
                title={
                  onCooldown
                    ? 'Sync déjà lancée, réessaie après le délai'
                    : 'Importer les dernières publications Instagram'
                }
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  scraping || onCooldown
                    ? 'cursor-not-allowed bg-ink-100 text-ink-400'
                    : 'bg-ink-950 text-white hover:bg-ink-800'
                }`}
              >
                <FontAwesomeIcon
                  icon={scraping ? faSpinner : faInstagram}
                  className={`h-4 w-4 ${scraping ? 'animate-spin' : ''}`}
                />
                {scraping
                  ? 'Lancement…'
                  : onCooldown
                  ? `Sync en cours - ${cdMins}m ${String(cdSecs).padStart(
                      2,
                      '0'
                    )}s`
                  : 'Sync Instagram'}
              </button>
            </div>
          )}
        </div>

        {items.length > 0 ? (
          <ul className='mt-6 grid grid-cols-1 items-start gap-5 md:grid-cols-2 lg:grid-cols-3'>
            {items.map((it) => (
              <li key={it.id} className='list-none'>
                <RealisationCard item={it} />
              </li>
            ))}
          </ul>
        ) : (
          <p className='mt-8 rounded-2xl bg-ink-50 px-6 py-10 text-center text-sm text-ink-500'>
            Aucune réalisation — ajoutez-en une ou scrapez Instagram.
          </p>
        )}
      </div>

      {adding &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className='fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-3'
            onClick={() => setAdding(false)}
          >
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={create}
              className='relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-lg bg-white p-5 text-ink-950 shadow-2xl'
            >
              <button
                type='button'
                aria-label='Fermer'
                onClick={() => setAdding(false)}
                className='absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-ink-100 text-ink-600 hover:bg-ink-200'
              >
                <FontAwesomeIcon icon={faXmark} className='h-4 w-4' />
              </button>

              <h2 className='pr-10 text-lg font-extrabold'>
                Nouvelle réalisation
              </h2>

              <label className='mt-4 block'>
                <span className={labelCls}>Titre</span>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className={inputCls}
                />
              </label>
              <label className='mt-3 block'>
                <span className={labelCls}>Description</span>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className={inputCls}
                />
              </label>

              <div className='mt-4'>
                <span className={labelCls}>Photos (max 10)</span>
                <div className='mt-1'>
                  <ImagesEditor max={10} onChange={setFiles} />
                </div>
              </div>

              <button
                type='submit'
                disabled={busy}
                className='mt-5 w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60'
              >
                {busy ? 'Publication…' : 'Publier la réalisation'}
              </button>
            </form>
          </div>,
          document.body
        )}
    </section>
  )
}
