'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faLock,
  faRightToBracket
} from '@fortawesome/free-solid-svg-icons'
import { setMerchantKey } from '../_lib/useMerchantKey'

export default function LoginPage() {
  const router = useRouter()
  const [id, setId] = useState('')
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, pwd })
      })
      const data = await res.json()
      if (res.ok && data.key) {
        setMerchantKey(data.key)
        router.push('/')
      } else {
        setError('Identifiants invalides')
      }
    } catch {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='mx-auto mt-6 max-w-sm rounded-lg bg-ink-700 p-6 text-white ring-1 ring-white/10 lg:mt-12'>
      <h1 className='text-xl font-extrabold'>Espace vendeur</h1>
      <p className='mt-1 text-sm text-white'>
        Connectez-vous pour gérer vos véhicules et vos articles en vente.
      </p>

      <form onSubmit={submit} className='mt-6 space-y-3'>
        <label className='flex items-center gap-2 rounded-lg bg-black/40 px-3 py-2.5 ring-1 ring-white/10 focus-within:ring-brand-500'>
          <FontAwesomeIcon icon={faUser} className='h-4 w-4 text-white/60' />
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder='Identifiant'
            autoComplete='username'
            className='w-full bg-transparent text-sm outline-none placeholder:text-white/60'
          />
        </label>
        <label className='flex items-center gap-2 rounded-lg bg-black/40 px-3 py-2.5 ring-1 ring-white/10 focus-within:ring-brand-500'>
          <FontAwesomeIcon icon={faLock} className='h-4 w-4 text-white/60' />
          <input
            type='password'
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder='Mot de passe'
            autoComplete='current-password'
            className='w-full bg-transparent text-sm outline-none placeholder:text-white/60'
          />
        </label>

        {error && <p className='text-sm font-medium text-danger'>{error}</p>}

        <button
          type='submit'
          disabled={loading}
          className='flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60'
        >
          <FontAwesomeIcon icon={faRightToBracket} className='h-4 w-4' />
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}
