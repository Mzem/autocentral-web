import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faArrowRight, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BackgroundCarousel from './BackgroundCarousel'

/**
 * "Tunisian Cars Club" full-screen section (photo carousel in the background).
 * Shown as the last block of the home page, right before the footer.
 */
export default function CommunitySection({ images }: { images: string[] }) {
  return (
    <section className='relative flex min-h-[100svh] items-center overflow-hidden'>
      <BackgroundCarousel
        images={images}
        intervalMs={7000}
        overlayClassName='bg-black/50'
      />

      <div className='relative z-10 mx-auto w-[92%] xl:max-w-3xl py-24 text-center lg:py-28'>
        <p className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/80 backdrop-blur'>
          <FontAwesomeIcon
            icon={faUsers}
            className='h-3.5 w-3.5 text-brand-400'
          />
          Tunisian Cars Club
        </p>
        <h2 className='mt-6 text-balance text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl'>
          Une communauté de passionnés unique en Tunisie
        </h2>
        <p className='mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-white/80'>
          Des rassemblements, des routes mythiques et une même exigence :
          l&apos;amour du beau véhicule. Rejoignez celles et ceux qui vivent
          l&apos;automobile autrement.
        </p>
        <div className='mt-8 flex justify-center'>
          <a
            href='https://www.instagram.com/tunisiancars.tn'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10'
          >
            <FontAwesomeIcon icon={faInstagram} className='h-4 w-4' />
            Rejoindre la communauté
            <FontAwesomeIcon icon={faArrowRight} className='h-3.5 w-3.5' />
          </a>
        </div>
      </div>
    </section>
  )
}
