import type { Metadata } from 'next'
import { acPageMetadata } from '../../_lib/site-metadata'
import Encheres from '../../_views/Encheres'

// Fed by a daily scrape (09:00): revalidating every 10 min is plenty.
export const revalidate = 600

export const metadata: Metadata = acPageMetadata({
  title: 'Enchères véhicules en Tunisie - Douane & JORT | Autocentral',
  description:
    'Tous les véhicules mis aux enchères publiques en Tunisie (Douane, JORT) : mise à prix, caution, lieu, dernier délai, avis officiel et fiche du véhicule décodée depuis le VIN.',
  path: '/encheres'
})

export default function EncheresPage() {
  return <Encheres />
}
