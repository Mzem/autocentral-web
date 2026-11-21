import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { permanentRedirect } from 'next/navigation'
import AnnonceDetail, { annonceMetadata } from '../../../_views/AnnonceDetail'
import { AC_URL } from '../../../_lib/site'

export async function generateMetadata({
  params
}: {
  params: { id?: string }
}): Promise<Metadata> {
  return annonceMetadata(params.id, 'tc')
}

/**
 * Full listing page on tunisiancars.com.tn = a DIRECT visit (Google, shared
 * link, refresh): it goes to autocentral.tn, the listing's canonical URL.
 *
 * A listing opened from /vente is an in-app navigation: Next renders the
 * intercepting modal (@modal/(.)annonces/[id]) instead of this page, so the
 * visitor stays on Tunisian Cars. (The middleware can't make that distinction:
 * Next strips the RSC headers before it runs.)
 */
export default function Annonce({ params }: { params: { id: string } }) {
  const raw = headers().get('x-forwarded-host') ?? headers().get('host') ?? ''
  const host = raw.split(',')[0].trim().toLowerCase().replace(/:\d+$/, '')
  if (host === 'tunisiancars.com.tn' || host.endsWith('.tunisiancars.com.tn')) {
    permanentRedirect(`${AC_URL}/annonces/${encodeURIComponent(params.id)}`)
  }
  return <AnnonceDetail id={params.id} />
}
