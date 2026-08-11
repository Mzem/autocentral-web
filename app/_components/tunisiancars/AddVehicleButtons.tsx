'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCar, faMotorcycle } from '@fortawesome/free-solid-svg-icons'
import { useMerchantKey } from '../../_lib/useMerchantKey'

/**
 * Admin-only pair of "add" buttons — icon only (no text): a car (new listing)
 * and a moto (new moto). Plain anchors (full navigation) so the annonce modal
 * interceptor doesn't hijack the routes.
 */
export default function AddVehicleButtons() {
  const { key } = useMerchantKey()
  if (!key) return null

  const btn =
    'inline-flex h-9 w-11 items-center justify-center rounded-lg bg-brand-500 text-white transition-colors hover:bg-brand-600'

  return (
    <>
      <a
        href='/annonces/nouveau'
        aria-label='Ajouter un véhicule'
        className={btn}
      >
        <span className='mr-1 font-bold'>+</span>
        <FontAwesomeIcon icon={faCar} className='h-4 w-4' />
      </a>
      <a
        href='/annonces/moto-nouveau'
        aria-label='Ajouter une moto'
        className={btn}
      >
        <span className='mr-1 font-bold'>+</span>
        <FontAwesomeIcon icon={faMotorcycle} className='h-4 w-4' />
      </a>
    </>
  )
}
