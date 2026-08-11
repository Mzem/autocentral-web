'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMotorcycle, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { MotoListItem } from '../../../api/services/moto-posts.service'
import { useMerchantKey } from '../../_lib/useMerchantKey'
import MotoCard from './MotoCard'

const GRID = 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'

/**
 * Home "Motos" category. Public gets the server-rendered (hidden-free) list; a
 * logged-in merchant refetches including hidden motos so they can manage them.
 */
export default function MotoShowroom({
  initialMotos
}: {
  initialMotos: MotoListItem[]
}) {
  const { key, ready } = useMerchantKey()
  const [motos, setMotos] = useState<MotoListItem[]>(initialMotos)
  const [showSold, setShowSold] = useState(false)

  useEffect(() => {
    if (!ready) return
    if (!key) {
      setMotos(initialMotos)
      return
    }
    let cancelled = false
    fetch('/api/admin/motos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authKey: key })
    })
      .then((r) => r.json())
      .then((data: MotoListItem[]) => {
        if (!cancelled) setMotos(Array.isArray(data) ? data : initialMotos)
      })
      .catch(() => {
        if (!cancelled) setMotos(initialMotos)
      })
    return () => {
      cancelled = true
    }
  }, [ready, key, initialMotos])

  const available = motos.filter((m) => !m.isExpired)
  const sold = motos.filter((m) => m.isExpired)

  return (
    <section>
      <header>
        <h2 className='text-lg font-bold tracking-tight lg:text-xl'>
          <FontAwesomeIcon
            icon={faMotorcycle}
            className='mr-2 inline-block h-5 w-5 text-brand-500'
          />
          Motos
        </h2>
      </header>

      {available.length > 0 ? (
        <ul className={`mt-2 lg:mt-6 ${GRID}`}>
          {available.map((m) => (
            <li key={m.id} className='list-none'>
              <MotoCard moto={m} />
            </li>
          ))}
        </ul>
      ) : (
        <p className='mt-5 rounded-2xl bg-ink-50 px-6 py-10 text-center text-sm text-ink-500'>
          Aucune moto disponible pour le moment.
        </p>
      )}

      {sold.length > 0 && (
        <div className='mt-5'>
          <button
            type='button'
            onClick={() => setShowSold((o) => !o)}
            className='rounded-full border border-ink-200 px-4 py-2 text-left text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50'
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`mr-2 inline-block h-3.5 w-3.5 align-[-0.05em] text-brand-500 transition-transform ${
                showSold ? 'rotate-180' : ''
              }`}
            />
            {showSold ? 'Masquer' : 'Voir'} les motos déjà vendues (
            {sold.length})
          </button>
          {showSold && (
            <ul className={`mt-6 ${GRID}`}>
              {sold.map((m) => (
                <li key={m.id} className='list-none'>
                  <MotoCard moto={m} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}
