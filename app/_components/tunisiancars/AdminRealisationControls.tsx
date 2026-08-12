'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPen,
  faTrash,
  faXmark,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons'
import { RealisationItem } from '../../../api/services/realisations.service'
import { useMerchantKey } from '../../_lib/useMerchantKey'
import ImagesEditor from './ImagesEditor'

const inputCls =
  'mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500'
const labelCls = 'text-xs font-medium text-ink-500'

async function failMessage(res: Response): Promise<string> {
  try {
    const d = await res.json()
    return d?.error ? `${d.error}` : `Erreur ${res.status}`
  } catch {
    return `Erreur ${res.status}`
  }
}

/** Edit / delete / photos controls overlaid on a réalisation card (admin only). */
export default function AdminRealisationControls({
  item
}: {
  item: RealisationItem
}) {
  const { key } = useMerchantKey()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    isHidden: false
  })

  if (!key) return null

  const openEdit = () => {
    setForm({
      title: item.title ?? '',
      description: item.description ?? '',
      isHidden: !!item.isHidden
    })
    setEditing(true)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await fetch('/api/realisation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: item.id,
          authKey: key,
          title: form.title,
          description: form.description,
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

  const remove = async () => {
    if (!window.confirm('Supprimer définitivement cette réalisation ?')) return
    try {
      const res = await fetch('/api/realisation', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: item.id, authKey: key })
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
    const res = await fetch(`/api/realisation/images?postId=${item.id}`, {
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

      {item.isHidden && (
        <span className='absolute left-2 top-2 z-10 inline-flex items-center gap-1.5 rounded-md bg-black/75 px-2.5 py-1.5 text-xs font-bold text-white shadow ring-1 ring-white/25 backdrop-blur-sm'>
          <FontAwesomeIcon icon={faEyeSlash} className='h-4 w-4' /> Masquée
        </span>
      )}

      {editing &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className='fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-3'
            onClick={() => setEditing(false)}
          >
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={save}
              className='relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-lg bg-white p-5 text-ink-950 shadow-2xl'
            >
              <button
                type='button'
                aria-label='Fermer'
                onClick={() => setEditing(false)}
                className='absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-ink-100 text-ink-600 hover:bg-ink-200'
              >
                <FontAwesomeIcon icon={faXmark} className='h-4 w-4' />
              </button>

              <h2 className='pr-10 text-lg font-extrabold'>
                Modifier la réalisation
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
              <label className='mt-3 flex items-center gap-2 text-sm'>
                <input
                  type='checkbox'
                  checked={form.isHidden}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isHidden: e.target.checked }))
                  }
                />
                Masquée
              </label>

              <div className='mt-4'>
                <span className={labelCls}>Photos (max 10)</span>
                <div className='mt-1'>
                  <ImagesEditor
                    initialUrls={item.images}
                    max={10}
                    onSave={saveImages}
                  />
                </div>
              </div>

              <button
                type='submit'
                disabled={busy}
                className='mt-5 w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60'
              >
                {busy ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </form>
          </div>,
          document.body
        )}
    </>
  )
}
