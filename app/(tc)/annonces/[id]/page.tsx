import type { Metadata } from 'next'
import AnnonceDetail, { annonceMetadata } from '../../../_views/AnnonceDetail'

export async function generateMetadata({
  params
}: {
  params: { id?: string }
}): Promise<Metadata> {
  return annonceMetadata(params.id, 'tc')
}

export default function Annonce({ params }: { params: { id: string } }) {
  return <AnnonceDetail id={params.id} />
}
