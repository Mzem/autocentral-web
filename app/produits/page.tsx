import { Metadata } from 'next'
import {
  getMerchItems,
  MerchItem
} from '../../api/services/merch-items.service'
import { MerchItems } from '../_components/MerchItems'
import { AddMerchButton } from '../_components/tunisiancars/AdminMerchControls'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'

// Only the Tunisian Cars shop's own items are shown in the boutique.
const SHOP_MERCHANT_ID = 'tunisian-cars'

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: 'https://tunisiancars.com.tn/produits'
    }
  }
}

export default async function Boutique() {
  let merchItems: MerchItem[] = []
  try {
    merchItems = await getMerchItems(SHOP_MERCHANT_ID)
  } catch {
    merchItems = []
  }

  return (
    <div className='mt-14 min-h-screen bg-white text-ink-950 lg:mt-16'>
      <div className='mx-auto w-[92%] xl:max-w-6xl py-10 lg:py-16'>
        <header className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500'>
              <FontAwesomeIcon icon={faCartShopping} className='h-4 w-4' />
              Boutique
            </p>
            <h1 className='mt-3 text-2xl font-extrabold tracking-tight lg:text-4xl'>
              Produits dérivés Tunisian Cars
            </h1>
            <p className='mt-2 max-w-xl text-sm text-ink-600 lg:text-base'>
              Vêtements, miniatures, décoration et accessoires à l&apos;effigie
              du garage.
            </p>
          </div>
          <AddMerchButton merchantId={SHOP_MERCHANT_ID} />
        </header>

        <div className='mt-8 lg:mt-12'>
          {merchItems.length > 0 ? (
            <MerchItems merchItems={merchItems} />
          ) : (
            <div className='rounded-2xl bg-ink-50 px-6 py-16 text-center text-ink-600'>
              Aucun article pour le moment - la boutique Tunisian Cars arrive
              très bientôt.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
