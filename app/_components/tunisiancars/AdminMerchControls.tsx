'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPen,
  faTrash,
  faXmark,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import {
  MerchItem,
  MERCH_CATEGORIES
} from '../../../api/services/merch-items.service'
import { useMerchantKey } from '../../_lib/useMerchantKey'
import ImagesEditor from './ImagesEditor'

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

function ModalShell({
  title,
  onClose,
  children
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  if (typeof document === 'undefined') return null
  return createPortal(
    <div
      className='fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-3'
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className='relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-5 text-ink-950 shadow-2xl'
      >
        <button
          type='button'
          aria-label='Fermer'
          onClick={onClose}
          className='absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-ink-100 text-ink-600 hover:bg-ink-200'
        >
          <FontAwesomeIcon icon={faXmark} className='h-4 w-4' />
        </button>
        <h2 className='text-lg font-extrabold'>{title}</h2>
        {children}
      </div>
    </div>,
    document.body
  )
}

/** Pencil (edit) + trash (delete) shown on a merch item when logged in. */
export function AdminMerchControls({ item }: { item: MerchItem }) {
  const { key } = useMerchantKey()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: MERCH_CATEGORIES[0] as string,
    inStock: true
  })

  if (!key) return null

  const openEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setForm({
      title: item.title ?? '',
      description: item.description ?? '',
      price: item.price != null ? String(item.price) : '',
      category: item.category ?? MERCH_CATEGORIES[0],
      inStock: item.inStock
    })
    setEditing(true)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await fetch('/api/merch-item', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          authKey: key,
          title: form.title || undefined,
          description: form.description || undefined,
          price: form.price || undefined,
          category: form.category || undefined,
          inStock: form.inStock ? 'true' : 'false'
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

  const remove = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm('Supprimer définitivement cet article ?')) return
    try {
      const res = await fetch('/api/merch-item', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, authKey: key })
      })
      if (!res.ok) throw new Error(await failMessage(res))
      router.refresh()
    } catch (err) {
      alert(`Échec de la suppression : ${(err as Error).message}`)
    }
  }

  const saveImages = async (order: string[], files: File[]) => {
    const fd = new FormData()
    files.forEach((f) => fd.append('files', f))
    fd.append('authKey', key)
    fd.append('order', JSON.stringify(order))
    const res = await fetch(`/api/merch-item/images?itemId=${item.id}`, {
      method: 'PATCH',
      body: fd
    })
    if (!res.ok) throw new Error(await failMessage(res))
    router.refresh()
  }

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

      {editing && (
        <ModalShell
          title="Modifier l'article"
          onClose={() => setEditing(false)}
        >
          <div className='mt-4'>
            <p className='text-sm font-semibold'>Photos</p>
            <div className='mt-2'>
              <ImagesEditor
                initialUrls={item.images ?? []}
                max={5}
                onSave={saveImages}
              />
            </div>
          </div>

          <hr className='my-4 border-ink-100' />

          <form onSubmit={save} className='space-y-3'>
            <label className='block'>
              <span className='text-xs font-medium text-ink-500'>Titre</span>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputCls}
              />
            </label>
            <label className='block'>
              <span className='text-xs font-medium text-ink-500'>
                Description
              </span>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                className={inputCls}
              />
            </label>
            <div className='grid grid-cols-2 gap-3'>
              <label className='block'>
                <span className='text-xs font-medium text-ink-500'>
                  Prix (DT)
                </span>
                <input
                  type='number'
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className={inputCls}
                />
              </label>
              <label className='block'>
                <span className='text-xs font-medium text-ink-500'>
                  Catégorie
                </span>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className={inputCls}
                >
                  {MERCH_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className='flex items-center gap-2 text-sm'>
              <input
                type='checkbox'
                checked={form.inStock}
                onChange={(e) =>
                  setForm({ ...form, inStock: e.target.checked })
                }
              />
              En stock
            </label>
            <button
              type='submit'
              disabled={busy}
              className='mt-2 w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60'
            >
              {busy ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </form>
        </ModalShell>
      )}
    </>
  )
}

/** Floating "+" to create a new merch item (with photos). */
export function AddMerchButton({ merchantId }: { merchantId: string }) {
  const { key } = useMerchantKey()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: MERCH_CATEGORIES[0] as string,
    inStock: true
  })

  if (!key) return null

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) {
      alert('Ajoutez au moins une photo')
      return
    }
    setBusy(true)
    try {
      const fd = new FormData()
      // Order matters: the first file becomes the main thumbnail.
      files.forEach((f) => fd.append('files', f))
      fd.append('authKey', key)
      fd.append('merchantId', merchantId)
      fd.append('title', form.title)
      if (form.description) fd.append('description', form.description)
      if (form.price) fd.append('price', form.price)
      fd.append('category', form.category)
      fd.append('inStock', form.inStock ? 'true' : 'false')

      const res = await fetch('/api/merch-item', { method: 'POST', body: fd })
      if (!res.ok) throw new Error(await failMessage(res))
      setOpen(false)
      setForm({
        title: '',
        description: '',
        price: '',
        category: MERCH_CATEGORIES[0],
        inStock: true
      })
      setFiles([])
      router.refresh()
    } catch (err) {
      alert(`Échec de l'ajout : ${(err as Error).message}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600'
      >
        <FontAwesomeIcon icon={faPlus} className='h-4 w-4' />
        Ajouter article
      </button>

      {open && (
        <ModalShell title='Nouvel article' onClose={() => setOpen(false)}>
          <form onSubmit={create} className='mt-4 space-y-3'>
            <label className='block'>
              <span className='text-xs font-medium text-ink-500'>Titre</span>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputCls}
              />
            </label>
            <label className='block'>
              <span className='text-xs font-medium text-ink-500'>
                Description
              </span>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                className={inputCls}
              />
            </label>
            <div className='grid grid-cols-2 gap-3'>
              <label className='block'>
                <span className='text-xs font-medium text-ink-500'>
                  Prix (DT)
                </span>
                <input
                  type='number'
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className={inputCls}
                />
              </label>
              <label className='block'>
                <span className='text-xs font-medium text-ink-500'>
                  Catégorie
                </span>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className={inputCls}
                >
                  {MERCH_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className='block'>
              <span className='text-xs font-medium text-ink-500'>
                Photos (max 5)
              </span>
              <div className='mt-1'>
                <ImagesEditor max={5} onChange={setFiles} />
              </div>
            </div>
            <label className='flex items-center gap-2 text-sm'>
              <input
                type='checkbox'
                checked={form.inStock}
                onChange={(e) =>
                  setForm({ ...form, inStock: e.target.checked })
                }
              />
              En stock
            </label>
            <button
              type='submit'
              disabled={busy}
              className='mt-2 w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60'
            >
              {busy ? 'Publication…' : 'Publier'}
            </button>
          </form>
        </ModalShell>
      )}
    </>
  )
}
