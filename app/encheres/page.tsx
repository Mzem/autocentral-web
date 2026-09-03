import type { Metadata } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGavel } from '@fortawesome/free-solid-svg-icons'
import { getAuctions } from '../../api/services/auctions.service'
import EncheresList from '../_components/tunisiancars/EncheresList'

// Fed by a daily scrape (09:00): revalidating every 10 min is plenty.
export const revalidate = 600

export const metadata: Metadata = {
  title: 'Enchères véhicules en Tunisie - Douane & JORT | Tunisian Cars',
  description:
    'Tous les véhicules mis aux enchères publiques en Tunisie (Douane, JORT) : mise à prix, caution, lieu, dernier délai, avis officiel et fiche du véhicule décodée depuis le VIN.',
  alternates: { canonical: 'https://tunisiancars.com.tn/encheres' }
}

export default async function EncheresPage() {
  const items = await getAuctions()

  // Full-bleed white page (registered as such in MainShell), same skeleton as
  // /annonces: a black strip under the fixed header, then the centred content.
  // overflow-x-hidden guards against any stray horizontal scroll.
  return (
    <div className='min-h-screen w-full overflow-x-hidden bg-white pb-10 text-ink-950'>
      <div className='mb-6 h-16 bg-black lg:mb-10' />
      <div className='mx-auto w-[92%] xl:max-w-6xl'>
        <div className='max-w-2xl'>
          <p className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500'>
            <FontAwesomeIcon icon={faGavel} className='h-4 w-4' />
            Enchères publiques
          </p>
          <h1 className='mt-3 text-3xl font-extrabold tracking-tight lg:text-4xl'>
            Véhicules aux enchères en Tunisie
          </h1>
          <p className='mt-4 text-pretty leading-relaxed text-ink-600'>
            Les lots de véhicules en cours de vente par la Douane et au JORT,
            avec mise à prix, caution, lieu de dépôt, dernier délai, l&apos;avis
            officiel — et la fiche du véhicule décodée depuis son numéro de
            châssis (VIN). Mis à jour chaque matin depuis{' '}
            <a
              href='https://encheres.tn'
              target='_blank'
              rel='noopener noreferrer'
              className='font-semibold text-brand-600 hover:underline'
            >
              encheres.tn
            </a>
            .
          </p>
        </div>

        <EncheresList items={items} />
      </div>
    </div>
  )
}
