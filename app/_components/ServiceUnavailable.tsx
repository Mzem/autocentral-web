'use client'

import { useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight, faCarBurst } from '@fortawesome/free-solid-svg-icons'
import '../_lib/fontawesome'

/**
 * Body of each site's `error.tsx`: a page whose data couldn't be loaded (API
 * down / timing out) shows this inside the site's header and footer, instead
 * of a bare 500. "Réessayer" re-runs the server render (router.refresh) and
 * then resets the boundary.
 */
export default function ServiceUnavailable({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    console.error('Page render error', error.digest ?? error.message)
  }, [error])

  const retry = () =>
    startTransition(() => {
      router.refresh()
      reset()
    })

  return (
    <div className='mx-auto flex min-h-[70vh] w-[92%] max-w-md flex-col items-center justify-center py-24 text-center text-white'>
      <FontAwesomeIcon
        icon={faCarBurst}
        aria-hidden='true'
        className='h-24 text-white/25'
      />
      <p className='mt-6 text-xl font-bold lg:text-2xl'>
        Service momentanément indisponible
      </p>
      <p className='mt-2 text-sm text-white/55'>
        Nous n&apos;arrivons pas à charger cette page pour le moment. Réessayez
        dans quelques instants.
      </p>
      <button
        type='button'
        onClick={retry}
        disabled={pending}
        className='mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/85 disabled:opacity-60'
      >
        <FontAwesomeIcon
          icon={faRotateRight}
          className={`h-3.5 w-3.5 ${pending ? 'animate-spin' : ''}`}
        />
        Réessayer
      </button>
    </div>
  )
}
