import type { Metadata } from 'next'
import { acPageMetadata } from '../../_lib/site-metadata'
import AnnoncesSearch, { SearchParams } from '../../_views/AnnoncesSearch'

// Search + results depend on the query string, so always render per request.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = acPageMetadata({
  title: "Moteur de recherche - voitures d'occasion en Tunisie | Autocentral",
  description:
    "Recherchez parmi toutes les annonces de voitures d'occasion en Tunisie : marque, modèle, prix, année, kilométrage, région.",
  path: '/annonces'
})

export default function AnnoncesPage({
  searchParams
}: {
  searchParams: SearchParams
}) {
  return <AnnoncesSearch searchParams={searchParams} />
}
