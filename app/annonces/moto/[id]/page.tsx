import { Metadata } from 'next'
import { getMoto } from '../../../../api/services/moto-posts.service'
import MotoDetail from '../../../_components/tunisiancars/MotoDetail'

// Reject junk ids (bot probes, stray path chars) before the API call.
const isMotoId = (s?: string): boolean =>
  !!s &&
  s !== 'null' &&
  s !== 'undefined' &&
  !/[./\\]/.test(s) &&
  s.length <= 80

export async function generateMetadata({
  params
}: {
  params: { id?: string }
}): Promise<Metadata> {
  const moto =
    params.id && isMotoId(params.id) ? await getMoto(params.id) : undefined
  const url = params.id
    ? `https://tunisiancars.com.tn/annonces/moto/${params.id}`
    : 'https://tunisiancars.com.tn'

  if (moto) {
    const title =
      moto.title ??
      `${moto.make ?? ''} ${moto.model ?? ''}`.trim() ??
      'Moto Tunisian Cars'
    return {
      alternates: { canonical: url },
      description: title,
      openGraph: {
        type: 'website',
        url,
        title,
        siteName: title,
        images: moto.images[0] || '/logo_rect.jpg'
      }
    }
  }
  return {
    description: 'Annonce moto Tunisian Cars',
    alternates: { canonical: url }
  }
}

export default async function MotoAnnonce({
  params
}: {
  params: { id: string }
}) {
  const moto = isMotoId(params.id) ? await getMoto(params.id) : undefined

  if (!moto) {
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
      <MotoDetail moto={moto} />
    </div>
  )
}
