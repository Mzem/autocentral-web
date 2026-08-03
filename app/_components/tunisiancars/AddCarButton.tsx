'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useMerchantKey } from '../../_lib/useMerchantKey'

/**
 * "+" to add a new vehicle — visible only to a logged-in merchant. Uses a plain
 * anchor (full navigation) so the `@modal/(.)annonces/[id]` interceptor doesn't
 * hijack `/annonces/nouveau` as a listing modal.
 */
export default function AddCarButton() {
  const { key } = useMerchantKey()
  if (!key) return null
  return (
    <a
      href='/annonces/nouveau'
      className='inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600'
    >
      <FontAwesomeIcon icon={faPlus} className='h-4 w-4' />
      Ajouter véhicule
    </a>
  )
}
