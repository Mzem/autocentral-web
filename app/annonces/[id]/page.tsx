import { Metadata } from 'next'
import { getCarPost } from '../../../api/services/car-posts.service'
import CarPostDetail from '../../_components/tunisiancars/CarPostDetail'

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
          ? `https://tunisiancars.com.tn/annonces/${params.id}`
          : 'https://tunisiancars.com.tn'
      },
      description: post.title,
      openGraph: {
        type: 'website',
        url: params.id
          ? `https://tunisiancars.com.tn/annonces/${params.id}`
          : 'https://tunisiancars.com.tn',
        title: post.title,
        siteName: post.title,
        images: post.images[0] || '/logo_rect.jpg'
      }
    }
  }
  return {
    description: 'Annonce Tunisian Cars',
    alternates: {
      canonical: params.id
        ? `https://tunisiancars.com.tn/annonces/${params.id}`
        : 'https://tunisiancars.com.tn'
    }
  }
}

export default async function Annonce({ params }: { params: { id: string } }) {
  const post = await getCarPost(params.id)

  if (!post) {
    return (
      <div className='mt-14 min-h-screen bg-white text-ink-950 lg:mt-16'>
        <div className='mx-auto w-[92%] py-24 text-center text-ink-500 xl:max-w-6xl'>
          Annonce introuvable ou expirée.
        </div>
      </div>
    )
  }

  return (
    <div className='mt-14 min-h-screen bg-white text-ink-950 lg:mt-16'>
      <CarPostDetail post={post} />
    </div>
  )
}
