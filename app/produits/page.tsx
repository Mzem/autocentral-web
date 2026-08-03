import { Metadata } from 'next'
import {
  getMerchItems,
  MerchItem
} from '../../api/services/merch-items.service'
import { MerchItems } from '../_components/MerchItems'

// Only the Tunisian Cars shop's own items are shown in the boutique.
const SHOP_MERCHANT_ID = 'tunisian-cars'

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: 'https://tunisiancars.com.tn/produits'
    }
  }
}

export default async function Merchants() {
  let merchItems: MerchItem[] = []
  try {
    merchItems = await getMerchItems(SHOP_MERCHANT_ID)
  } catch {
    merchItems = []
  }

  return (
    <>
      <div className='text-center text-lg lg:text-2xl mt-9 lg:mt-20 text-white flex items-center space-x-2 ml-[2px] mb-8'>
        <p>Boutique & Produits dérivés</p>
        <img src='/race_flag.svg' className='h-4 lg:h-5 invert' />
      </div>

      {merchItems.length > 0 ? (
        <MerchItems merchItems={merchItems} />
      ) : (
        <div className='mx-auto max-w-xl rounded-lg bg-surface px-6 py-16 text-center text-white/60'>
          Aucun article pour le moment — la boutique Tunisian Cars arrive très
          bientôt.
        </div>
      )}
    </>
  )
}
