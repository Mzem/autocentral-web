'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import { useMerchantKey } from '../../_lib/useMerchantKey'

const COOLDOWN_MS = 30 * 60 * 1000
const STORAGE_KEY = 'tc_fb_sync_until'

/**
 * Admin-only button to sync the Facebook page on demand. After a launch it stays
 * greyed for 30 min (tracked per-device in localStorage — approximate on
 * purpose) with a live countdown, to signal "already running".
 */
export default function FacebookSyncButton() {
  const { key } = useMerchantKey()
  const [until, setUntil] = useState(0)
  const [now, setNow] = useState(() => Date.now())
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setUntil(Number(window.localStorage.getItem(STORAGE_KEY) || 0))
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  if (!key) return null

  const remaining = Math.max(0, until - now)
  const onCooldown = remaining > 0
  const mins = Math.floor(remaining / 60000)
  const secs = Math.floor((remaining % 60000) / 1000)

  const launch = async () => {
    if (onCooldown || busy) return
    setBusy(true)
    try {
      const res = await fetch('/api/admin/sync-facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authKey: key })
      })
      if (!res.ok) throw new Error()
      const u = Date.now() + COOLDOWN_MS
      window.localStorage.setItem(STORAGE_KEY, String(u))
      setUntil(u)
    } catch {
      alert('Échec du lancement de la synchronisation Facebook')
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type='button'
      onClick={launch}
      disabled={onCooldown || busy}
      title={
        onCooldown
          ? 'Synchro déjà lancée, réessaie après le délai'
          : 'Récupérer les nouvelles annonces de la page Facebook'
      }
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
        onCooldown || busy
          ? 'cursor-not-allowed bg-ink-100 text-ink-400'
          : 'bg-[#1877F2] text-white hover:bg-[#0f66d0]'
      }`}
    >
      <FontAwesomeIcon
        icon={busy ? faRotate : faFacebook}
        className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`}
      />
      {busy
        ? 'Lancement…'
        : onCooldown
        ? `Sync en cours — ${mins}m ${String(secs).padStart(2, '0')}s`
        : 'Synchroniser FB'}
    </button>
  )
}
