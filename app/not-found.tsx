import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCarBurst } from '@fortawesome/free-solid-svg-icons'

export default async function NotFoundPage() {
  return (
    <>
      <div className='text-white mx-auto w-full flex flex-col items-center justify-around text-xl lg:text-2xl mt-[6rem]'>
        <FontAwesomeIcon
          icon={faCarBurst}
          aria-hidden='true'
          className='h-40 text-white/25'
        />
        <p className='mt-6'>Non trouvé(e)</p>
        <Link
          href='/'
          className='bg-ink-950 shadow px-8 py-3 rounded-xl mt-6 text-white italic text-base'
        >
          <img
            src='/tunisiancars/logo_rect.png'
            alt='Tunisian Cars'
            className='h-16'
          />
        </Link>
        <span className='text-white/55 italic text-sm mt-4'>
          Rechercher une voiture d&apos;occasion
        </span>
      </div>
    </>
  )
}
