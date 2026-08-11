import { Metadata } from 'next'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCarBurst } from '@fortawesome/free-solid-svg-icons'
import { getMerchItem } from '../../../api/services/merch-items.service'
import MerchItemModal from '../../_components/MerchItemModal'

export async function generateMetadata({
  params
}: {
  params: { id?: string }
}): Promise<Metadata> {
  const item = params.id ? await getMerchItem(params.id) : undefined
  const url = params.id
    ? `https://tunisiancars.com.tn/produits/${params.id}`
    : 'https://tunisiancars.com.tn'
  return {
    alternates: { canonical: url },
    description: item?.title ?? 'Boutique Tunisian Cars',
    openGraph: item
      ? {
          type: 'website',
          url,
          title: item.title,
          siteName: item.title,
          images: item.images?.[0] || '/logo_rect.jpg'
        }
      : undefined
  }
}

export default async function Produit({ params }: { params: { id: string } }) {
  const item = await getMerchItem(params.id)

  return (
    <div className='mt-14 min-h-screen bg-white text-ink-950 lg:mt-16'>
      <div className='mx-auto w-[92%] max-w-3xl py-8 lg:py-12'>
        <Link
          href='/produits'
          className='inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-1.5 text-sm font-semibold text-ink-800 transition-colors hover:bg-ink-50'
        >
          <FontAwesomeIcon icon={faArrowLeft} className='h-3.5 w-3.5' />
          Retour à la boutique
        </Link>

        <div className='mt-6'>
          {item ? (
            <MerchItemModal item={item} isFull={true} />
          ) : (
            <div className='flex flex-col items-center justify-center py-16 text-center'>
              <FontAwesomeIcon
                icon={faCarBurst}
                aria-hidden='true'
                className='h-32 text-ink-300'
              />
              <p className='mt-6 text-xl font-bold'>Article introuvable</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
