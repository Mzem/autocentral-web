'use client'

import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStar,
  faTrash,
  faArrowLeft,
  faArrowRight,
  faPlus
} from '@fortawesome/free-solid-svg-icons'

type Item = { key: string; url?: string; file?: File; preview: string }

/**
 * Image manager: keep / delete / reorder / add photos, with the first image as
 * the main thumbnail.
 *
 * - Edit mode (`onSave`): shows a save button; emits an `order` array (existing
 *   URLs + `__file_N__` tokens) and the new `files`, which the API reassembles.
 * - Create mode (`onChange`): no save button; reports the ordered new `files`
 *   live so the parent can submit them with the rest of the create form.
 */
export default function ImagesEditor({
  initialUrls = [],
  max,
  onSave,
  onChange
}: {
  initialUrls?: string[]
  max: number
  onSave?: (order: string[], files: File[]) => Promise<void>
  onChange?: (files: File[]) => void
}) {
  const [items, setItems] = useState<Item[]>(() =>
    initialUrls
      .filter(Boolean)
      .map((u, i) => ({ key: `u-${i}`, url: u, preview: u }))
  )
  const [busy, setBusy] = useState(false)
  const [dirty, setDirty] = useState(false)

  // Report the ordered new files to the parent (create mode), always latest.
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    onChangeRef.current?.(
      items.filter((it) => it.file).map((it) => it.file as File)
    )
  }, [items])

  const touch = () => setDirty(true)

  const addFiles = (fl: FileList | null) => {
    if (!fl) return
    const room = Math.max(0, max - items.length)
    const toAdd = Array.from(fl).slice(0, room)
    if (toAdd.length === 0) return
    setItems((prev) => [
      ...prev,
      ...toAdd.map((f, i) => ({
        key: `f-${Date.now()}-${i}`,
        file: f,
        preview: URL.createObjectURL(f)
      }))
    ])
    touch()
  }

  const remove = (key: string) => {
    setItems((p) => p.filter((it) => it.key !== key))
    touch()
  }

  const move = (idx: number, dir: -1 | 1) => {
    setItems((p) => {
      const a = [...p]
      const j = idx + dir
      if (j < 0 || j >= a.length) return p
      ;[a[idx], a[j]] = [a[j], a[idx]]
      return a
    })
    touch()
  }

  const makeThumb = (idx: number) => {
    setItems((p) => {
      if (idx === 0) return p
      const a = [...p]
      const [x] = a.splice(idx, 1)
      a.unshift(x)
      return a
    })
    touch()
  }

  const save = async () => {
    if (!onSave) return
    if (items.length === 0) {
      alert('Ajoutez au moins une photo')
      return
    }
    setBusy(true)
    try {
      const files: File[] = []
      const order = items.map((it) => {
        if (it.url) return it.url
        const idx = files.length
        files.push(it.file!)
        return `__file_${idx}__`
      })
      await onSave(order, files)
      setDirty(false)
    } catch (e) {
      alert(
        `Échec de la mise à jour des photos${
          (e as Error)?.message ? ' : ' + (e as Error).message : ''
        }`
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className='grid grid-cols-3 gap-2 sm:grid-cols-4'>
        {items.map((it, idx) => (
          <div
            key={it.key}
            className='group relative aspect-square overflow-hidden rounded-lg border border-ink-200'
          >
            <img
              src={it.preview}
              alt=''
              className='h-full w-full object-cover'
            />
            {idx === 0 && (
              <span className='absolute left-1 top-1 rounded bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold text-white'>
                Principale
              </span>
            )}
            <div className='absolute inset-x-0 bottom-0 flex items-center justify-around bg-black/55 py-1 text-white'>
              <button
                type='button'
                title='Vers la gauche'
                onClick={() => move(idx, -1)}
                disabled={idx === 0}
                className='px-1 disabled:opacity-30'
              >
                <FontAwesomeIcon icon={faArrowLeft} className='h-3 w-3' />
              </button>
              <button
                type='button'
                title='Définir comme principale'
                onClick={() => makeThumb(idx)}
                className='px-1'
              >
                <FontAwesomeIcon icon={faStar} className='h-3 w-3' />
              </button>
              <button
                type='button'
                title='Vers la droite'
                onClick={() => move(idx, 1)}
                disabled={idx === items.length - 1}
                className='px-1 disabled:opacity-30'
              >
                <FontAwesomeIcon icon={faArrowRight} className='h-3 w-3' />
              </button>
              <button
                type='button'
                title='Supprimer'
                onClick={() => remove(it.key)}
                className='px-1 text-danger'
              >
                <FontAwesomeIcon icon={faTrash} className='h-3 w-3' />
              </button>
            </div>
          </div>
        ))}
        {items.length < max && (
          <label className='flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-ink-300 text-ink-400 hover:border-brand-500 hover:text-brand-500'>
            <FontAwesomeIcon icon={faPlus} className='h-5 w-5' />
            <span className='mt-1 text-[10px]'>Ajouter</span>
            <input
              type='file'
              accept='image/*'
              multiple
              className='hidden'
              onChange={(e) => addFiles(e.target.files)}
            />
          </label>
        )}
      </div>

      <div className='mt-2 flex items-center justify-between'>
        <p className='text-xs text-ink-500'>
          {items.length}/{max} · la 1ère photo est la principale
        </p>
        {onSave && (
          <button
            type='button'
            onClick={save}
            disabled={busy || !dirty}
            className='rounded-lg bg-ink-950 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-ink-800 disabled:opacity-40'
          >
            {busy ? 'Envoi…' : 'Enregistrer les photos'}
          </button>
        )}
      </div>
    </div>
  )
}
