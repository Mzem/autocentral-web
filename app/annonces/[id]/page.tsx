import { Metadata } from 'next'
import CarPostModal from '../../_components/car-posts/CarPostModal'

export async function generateMetadata({
  params
}: {
  params: { id?: string }
}): Promise<Metadata> {
  return {
    alternates: {
      canonical: params.id
        ? `https://autocentral.tn/annonces/${params.id}`
        : 'https://autocentral.tn'
    }
  }
}

export default async function Annonce({ params }: { params: { id: string } }) {
  return (
    <>
      <CarPostModal postId={params.id} isFull={true} />
    </>
  )
}
