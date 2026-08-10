'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpFromBracket,
  faMobileScreen
} from '@fortawesome/free-solid-svg-icons'

// Chrome/Android fires this before showing its native install prompt; we catch
// it so we can trigger the prompt from our own button instead.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * "Ajouter à l'écran d'accueil" (PWA install) - shown in the footer.
 *
 *  - Chrome / Android / desktop: uses the captured `beforeinstallprompt` event.
 *  - iOS Safari (no such event): shows the manual Share → "Sur l'écran
 *    d'accueil" steps.
 *  - Already installed / running standalone: renders nothing.
 */
export default function InstallAppButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null
  )
  const [isIOS, setIsIOS] = useState(false)
  const [standalone, setStandalone] = useState(false)
  const [showIosHelp, setShowIosHelp] = useState(false)

  useEffect(() => {
    // Register the (no-op) service worker so the site is installable.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    const nav = window.navigator as Navigator & { standalone?: boolean }
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      nav.standalone === true
    setStandalone(isStandalone)

    const ua = nav.userAgent.toLowerCase()
    const iOS =
      /iphone|ipad|ipod/.test(ua) ||
      // iPadOS 13+ masquerades as macOS; fall back to a touch check.
      (/macintosh/.test(ua) && 'ontouchend' in document)
    setIsIOS(iOS)

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setDeferred(null)
      setStandalone(true)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  // Nothing to offer if it's already installed, or the browser can neither
  // prompt (no captured event) nor do the iOS manual flow.
  if (standalone || (!deferred && !isIOS)) return null

  const onClick = async () => {
    if (deferred) {
      await deferred.prompt()
      await deferred.userChoice
      setDeferred(null)
      return
    }
    setShowIosHelp((v) => !v)
  }

  return (
    <div className='relative'>
      <button
        type='button'
        onClick={onClick}
        className='inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-500/20'
      >
        <FontAwesomeIcon
          icon={faMobileScreen}
          className='h-3.5 w-3.5 text-brand-400'
        />
        Installer l&apos;application
      </button>

      {showIosHelp && (
        <div className='absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 rounded-lg border border-white/15 bg-ink-900 p-3 text-left text-[0.72rem] leading-relaxed text-white/85 shadow-xl'>
          Sur iPhone / iPad : appuyez sur{' '}
          <FontAwesomeIcon
            icon={faArrowUpFromBracket}
            className='mx-0.5 h-3 w-3 text-brand-400'
          />{' '}
          <span className='font-semibold'>Partager</span>, puis «&nbsp;Sur
          l&apos;écran d&apos;accueil&nbsp;».
        </div>
      )}
    </div>
  )
}
