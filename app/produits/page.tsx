import { Metadata } from 'next'
import { getMerchItems } from '../../api/services/merch-items.service'
import { MerchItems } from '../_components/MerchItems'

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: 'https://autocentral.tn/produits'
    }
  }
}

export default async function Merchants() {
  const merchItems = await getMerchItems()

  return (
    <>
      <div className='text-center text-lg lg:text-2xl mt-9 lg:mt-20 text-black flex items-center space-x-2 ml-[2px] mb-8'>
        <p>Boutique & Produits dérivés</p>
        <img src='/race_flag.svg' className='h-4 lg:h-5 invert' />
      </div>

      <MerchItems merchItems={merchItems} />
    </>
  )
}
