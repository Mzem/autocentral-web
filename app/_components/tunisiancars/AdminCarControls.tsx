'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPen,
  faTrash,
  faXmark,
  faImages,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons'
import { CarPostListItem } from '../../../api/services/car-posts.service'
import { fuelLabel } from '../../types'
import { useMerchantKey } from '../../_lib/useMerchantKey'
import ImagesEditor from './ImagesEditor'

type Form = {
  title: string
  description: string
  price: string
  km: string
  year: string
  make: string
  model: string
  fuel: string
  gearbox: string
  cv: string
  cylinder: string
  phone: string
  isExpired: boolean
  isHidden: boolean
}

// Values are the stored/API strings; the labels are shown via `fuelLabel`.
const FUEL_OPTIONS = [
  'Essence',
  'Diesel',
  'Essence Hybrid',
  'Diesel Hybrid',
  'Electrique'
]
const GEARBOX_OPTIONS = ['Automatique', 'Manuelle']
// Engine displacement must be a single digit, dot, single digit (e.g. "2.0").
const CYLINDER_RE = /^\d\.\d$/

const inputCls =
  'mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500'

async function failMessage(res: Response): Promise<string> {
  try {
    const d = await res.json()
    return d?.error ? `${d.error}` : `Erreur ${res.status}`
  } catch {
    return `Erreur ${res.status}`
  }
}

/**
 * Edit / delete / hide / photo controls overlaid on a listing card, shown only
 * when a merchant is logged in. All mutations go through Next API routes which
 * forward the key to the backend for validation + merchant scoping.
 */
export default function AdminCarControls({ post }: { post: CarPostListItem }) {
  const { key } = useMerchantKey()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[] | null>(null)
  const [loadingImages, setLoadingImages] = useState(false)
  const [form, setForm] = useState<Form>({
    title: '',
    description: '',
    price: '',
    km: '',
    year: '',
    make: '',
    model: '',
    fuel: '',
    gearbox: '',
    cv: '',
    cylinder: '',
    phone: '',
    isExpired: false,
    isHidden: false
  })

  if (!key) return null

  const stopNav = (e: React.SyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const openEdit = (e: React.SyntheticEvent) => {
    stopNav(e)
    setForm({
      title: post.title ?? '',
      description: '',
      price: post.price != null ? String(post.price) : '',
      km: post.km != null ? String(post.km) : '',
      year: post.year != null ? String(post.year) : '',
      make: post.make ?? '',
      model: post.model ?? '',
      fuel: post.fuel ?? '',
      gearbox: post.gearbox ?? '',
      cv: post.cv != null ? String(post.cv) : '',
      cylinder: '',
      // On-behalf listings show the owner number; prefill its local 8 digits.
      phone: post.isOnBehalf
        ? (post.phone ?? '').replace(/\D/g, '').slice(-8)
        : '',
      isExpired: !!post.isExpired,
      isHidden: !!post.isHidden
    })
    setImageUrls(null)
    setEditing(true)
    // The list item lacks cylinder + description (and may lag on other specs):
    // fetch the full detail to pre-fill them accurately.
    fetch(`/api/car-post?postId=${post.id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm((f) => ({
          ...f,
          description: data.description ?? f.description,
          cylinder: data.cylinder ?? f.cylinder,
          fuel: data.fuel ?? f.fuel,
          gearbox: data.gearbox ?? f.gearbox,
          cv: data.cv != null ? String(data.cv) : f.cv
        }))
      })
      .catch(() => {})
  }

  const loadImages = async () => {
    setLoadingImages(true)
    try {
      const res = await fetch(`/api/car-post?postId=${post.id}`)
      const data = await res.json()
      const urls: string[] =
        Array.isArray(data.images) && data.images.length
          ? data.images
          : data.thumbnail
          ? [data.thumbnail]
          : post.image
          ? [post.image]
          : []
      setImageUrls(urls)
    } catch {
      setImageUrls(post.image ? [post.image] : [])
    } finally {
      setLoadingImages(false)
    }
  }

  const saveImages = async (order: string[], files: File[]) => {
    const fd = new FormData()
    files.forEach((f) => fd.append('files', f))
    fd.append('authKey', key)
    fd.append('order', JSON.stringify(order))
    const res = await fetch(`/api/car-post/images?postId=${post.id}`, {
      method: 'PATCH',
      body: fd
    })
    if (!res.ok) throw new Error(await failMessage(res))
    router.refresh()
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    const cylinder = form.cylinder.trim()
    if (cylinder && !CYLINDER_RE.test(cylinder)) {
      alert('Cylindrée invalide : le format doit être x.x (ex. 2.0)')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/car-post', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          authKey: key,
          title: form.title || undefined,
          description: form.description || undefined,
          price: form.price || undefined,
          // Empty price field = clear it (back to "Prix sur demande").
          clearPrice: form.price.trim() === '' ? 'true' : undefined,
          km: form.km || undefined,
          year: form.year || undefined,
          make: form.make || undefined,
          model: form.model || undefined,
          fuel: form.fuel || undefined,
          gearbox: form.gearbox || undefined,
          cv: form.cv || undefined,
          cylinder: cylinder || undefined,
          // Owner phone only for on-behalf listings.
          phone:
            post.isOnBehalf && form.phone.trim()
              ? form.phone.trim()
              : undefined,
          isExpired: form.isExpired ? 'true' : 'false',
          isHidden: form.isHidden ? 'true' : 'false'
        })
      })
      if (!res.ok) throw new Error(await failMessage(res))
      setEditing(false)
      router.refresh()
    } catch (err) {
      alert(`Échec de la modification : ${(err as Error).message}`)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (e: React.SyntheticEvent) => {
    stopNav(e)
    if (!window.confirm('Supprimer définitivement cette annonce ?')) return
    try {
      const res = await fetch('/api/car-post', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, authKey: key })
      })
      if (!res.ok) throw new Error(await failMessage(res))
      router.refresh()
    } catch (err) {
      alert(`Échec de la suppression : ${(err as Error).message}`)
    }
  }

  const field = (
    label: string,
    name: keyof Form,
    type: 'text' | 'number' = 'text',
    hint?: string
  ) => (
    <label className='block'>
      <span className='text-xs font-medium text-ink-500'>{label}</span>
      <input
        type={type}
        value={form[name] as string}
        onChange={(ev) => setForm((f) => ({ ...f, [name]: ev.target.value }))}
        className={inputCls}
      />
      {hint && (
        <span className='mt-0.5 block text-[0.65rem] text-ink-400'>{hint}</span>
      )}
    </label>
  )

  const select = (label: string, name: keyof Form, options: string[]) => (
    <label className='block'>
      <span className='text-xs font-medium text-ink-500'>{label}</span>
      <select
        value={form[name] as string}
        onChange={(ev) => setForm((f) => ({ ...f, [name]: ev.target.value }))}
        className={inputCls}
      >
        <option value=''>-</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {fuelLabel(o)}
          </option>
        ))}
      </select>
    </label>
  )

  return (
    <>
      <div className='absolute right-2 top-2 z-10 flex gap-1.5'>
        <button
          type='button'
          aria-label='Modifier'
          onClick={openEdit}
          className='flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur transition hover:bg-black/80'
        >
          <FontAwesomeIcon icon={faPen} className='h-3.5 w-3.5' />
        </button>
        <button
          type='button'
          aria-label='Supprimer'
          onClick={remove}
          className='flex h-8 w-8 items-center justify-center rounded-lg bg-danger/90 text-white backdrop-blur transition hover:bg-danger'
        >
          <FontAwesomeIcon icon={faTrash} className='h-3.5 w-3.5' />
        </button>
      </div>

      {post.isHidden && (
        <span className='absolute bottom-2 left-2 z-10 inline-flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white'>
          <FontAwesomeIcon icon={faEyeSlash} className='h-3 w-3' /> Masquée
        </span>
      )}

      {editing &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className='fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-3'
            onClick={(e) => {
              stopNav(e)
              setEditing(false)
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className='relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-5 text-ink-950 shadow-2xl'
            >
              <button
                type='button'
                aria-label='Fermer'
                onClick={() => setEditing(false)}
                className='absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-ink-100 text-ink-600 hover:bg-ink-200'
              >
                <FontAwesomeIcon icon={faXmark} className='h-4 w-4' />
              </button>
              <h2 className='text-lg font-extrabold'>
                Modifier l&apos;annonce
              </h2>

              {/* Photos */}
              <div className='mt-4'>
                <p className='text-sm font-semibold'>Photos</p>
                {imageUrls === null ? (
                  <button
                    type='button'
                    onClick={loadImages}
                    disabled={loadingImages}
                    className='mt-2 inline-flex items-center gap-2 rounded-lg border border-ink-200 px-3 py-2 text-sm font-medium hover:border-brand-500 disabled:opacity-60'
                  >
                    <FontAwesomeIcon icon={faImages} className='h-4 w-4' />
                    {loadingImages ? 'Chargement…' : 'Gérer les photos'}
                  </button>
                ) : (
                  <div className='mt-2'>
                    <ImagesEditor
                      initialUrls={imageUrls}
                      max={20}
                      onSave={saveImages}
                    />
                  </div>
                )}
              </div>

              <hr className='my-4 border-ink-100' />

              {/* Details */}
              <form onSubmit={save}>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='col-span-2'>{field('Titre', 'title')}</div>
                  {post.isOnBehalf && (
                    <div className='col-span-2'>
                      {field(
                        'Téléphone du propriétaire',
                        'phone',
                        'number',
                        'Annonce au nom du propriétaire'
                      )}
                    </div>
                  )}
                  {field('Prix (DT)', 'price', 'number')}
                  {field('Kilométrage', 'km', 'number')}
                  {field('Année', 'year', 'number')}
                  {field('Marque', 'make')}
                  <div className='col-span-2'>{field('Modèle', 'model')}</div>
                  {select('Carburant', 'fuel', FUEL_OPTIONS)}
                  {select('Boîte', 'gearbox', GEARBOX_OPTIONS)}
                  {field('Puissance (cv)', 'cv', 'number')}
                  {field(
                    'Cylindrée',
                    'cylinder',
                    'text',
                    'Format x.x (ex. 2.0)'
                  )}
                  <label className='col-span-2 block'>
                    <span className='text-xs font-medium text-ink-500'>
                      Description
                    </span>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                      rows={4}
                      className={inputCls}
                    />
                  </label>
                </div>

                <div className='mt-3 flex flex-wrap gap-4'>
                  <label className='flex items-center gap-2 text-sm'>
                    <input
                      type='checkbox'
                      checked={form.isExpired}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, isExpired: e.target.checked }))
                      }
                    />
                    Vendu
                  </label>
                  <label className='flex items-center gap-2 text-sm'>
                    <input
                      type='checkbox'
                      checked={form.isHidden}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, isHidden: e.target.checked }))
                      }
                    />
                    Masquer (visible admin seulement)
                  </label>
                </div>

                <button
                  type='submit'
                  disabled={busy}
                  className='mt-5 w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60'
                >
                  {busy ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
