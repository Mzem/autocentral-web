import { Metadata } from 'next'
import CarPostModal from '../../_components/car-posts/CarPostModal'
import { getCarPost } from '../../../api/services/car-posts.service'

export async function generateMetadata({
  params
}: {
  params: { id?: string }
}): Promise<Metadata> {
  const post = params.id ? await getCarPost(params.id) : null

  if (post) {
    return {
      alternates: {
        canonical: params.id
          ? `https://autocentral.tn/annonces/${params.id}`
          : 'https://autocentral.tn'
      },
      description: post.title,
      openGraph: {
        type: 'website',
        url: params.id
          ? `https://autocentral.tn/annonces/${params.id}`
          : 'https://autocentral.tn',
        title: post.title,
        siteName: post.title,
        images: post.images[0] || '/logo_rect.jpg'
      }
    }
  }
  return {
    description: 'Annonce autocentral',
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
