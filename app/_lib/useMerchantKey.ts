'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'tc_merchant_key'

/**
 * Merchant admin secret key, persisted in localStorage after login. Its
 * presence unlocks the edit / add / delete controls on the site. The key is
 * sent to our Next API routes which forward it (as `authKey`) to the backend,
 * where it is re-validated against the USERS env and scoped to the merchant.
 */
export function getMerchantKey(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(STORAGE_KEY)
}

export function setMerchantKey(key: string | null) {
  if (typeof window === 'undefined') return
  if (key) window.localStorage.setItem(STORAGE_KEY, key)
  else window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('tc-merchant-key'))
}

export function useMerchantKey(): {
  key: string | null
  ready: boolean
  logout: () => void
} {
  const [key, setKey] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sync = () => setKey(getMerchantKey())
    sync()
    setReady(true)
    window.addEventListener('tc-merchant-key', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('tc-merchant-key', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return { key, ready, logout: () => setMerchantKey(null) }
}
