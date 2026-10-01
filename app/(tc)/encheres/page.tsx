import type { Metadata } from 'next'
import { AC_URL } from '../../_lib/site'
import Encheres from '../../_views/Encheres'

// Fed by a daily scrape (09:00): revalidating every 10 min is plenty.
export const revalidate = 600

// Auctions now belong to autocentral.tn (hence the canonical); kept reachable
// here for old links until the redirect is switched on (see middleware.ts).
export const metadata: Metadata = {
  title: 'Enchères véhicules en Tunisie - Douane & JORT | Tunisian Cars',
  description:
    'Tous les véhicules mis aux enchères publiques en Tunisie (Douane, JORT) : mise à prix, caution, lieu, dernier délai, avis officiel et fiche du véhicule décodée depuis le VIN.',
  alternates: { canonical: `${AC_URL}/encheres` }
}

export default function EncheresPage() {
  return <Encheres />
}
