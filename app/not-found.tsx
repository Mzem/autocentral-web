import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCarBurst } from '@fortawesome/free-solid-svg-icons'
import './_lib/fontawesome'

// Unmatched URLs on either site end up here, inside the root layout only (no
// site header/footer), so the page is neutral and self-contained. "/" is the
// home of whichever site the visitor is on.
export default function NotFoundPage() {
  return (
    <div className='mx-auto flex min-h-screen w-[92%] max-w-md flex-col items-center justify-center py-16 text-center text-white'>
      <FontAwesomeIcon
        icon={faCarBurst}
        aria-hidden='true'
        className='h-32 text-white/25'
      />
      <p className='mt-6 text-xl font-bold lg:text-2xl'>Page introuvable</p>
      <p className='mt-2 text-sm text-white/55'>
        Cette page n&apos;existe pas ou n&apos;existe plus.
      </p>
      <Link
        href='/'
        className='mt-6 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600'
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
