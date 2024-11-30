import { Metadata } from 'next'
import { getMerchItem } from '../../../api/services/merch-items.service'
import MerchItemModal from '../../_components/MerchItemModal'
import Link from 'next/link'

export async function generateMetadata({
  params
}: {
  params: { id?: string }
}): Promise<Metadata> {
  return {
    alternates: {
      canonical: params.id
        ? `https://autocentral.tn/produits/${params.id}`
        : 'https://autocentral.tn'
    }
  }
}

export default async function Produit({ params }: { params: { id: string } }) {
  const item = await getMerchItem(params.id)
  return (
    <>
      {!item && (
        <div className='text-black mx-auto w-full flex flex-col items-center justify-around text-xl lg:text-2xl mt-[6rem]'>
          <img src='/lost.svg' alt='Non trouvé(e)' className='max-h-96' />
          <p>Non trouvé(e)</p>
          <Link
            href='/'
            className='bg-blackopac shadow px-8 rounded-xl mt-6 text-white italic text-base'
          >
            <img src='/logo.svg' alt='' className='h-20' />
          </Link>
          <span className='text-blackopac2 italic text-sm mt-4'>
            Rechercher une voiture d'occasion
          </span>
        </div>
      )}
      {item && <MerchItemModal item={item} isFull={true} />}
    </>
  )
}
