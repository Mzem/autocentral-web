import type { Metadata } from 'next'
import { AC_URL } from '../../_lib/site'
import AnnoncesSearch, { SearchParams } from '../../_views/AnnoncesSearch'

// Search + results depend on the query string, so always render per request.
export const dynamic = 'force-dynamic'

// The search engine now belongs to autocentral.tn (hence the canonical). This
// URL stays reachable on tunisiancars.com.tn so old links keep working, until
// the redirect to autocentral.tn is switched on (see middleware.ts).
export const metadata: Metadata = {
  title: 'Annonces - Tunisian Cars',
  description: "Recherchez parmi toutes les annonces de voitures d'occasion.",
  alternates: { canonical: `${AC_URL}/annonces` }
}

export default function AnnoncesPage({
  searchParams
}: {
  searchParams: SearchParams
}) {
  return <AnnoncesSearch searchParams={searchParams} />
}
