import { Metadata } from 'next'
import Link from 'next/link'
import {
  getMerchItems,
  MerchItem
} from '../../api/services/merch-items.service'

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

      <div className='w-full mx-auto text-black'>
        {merchItems
          .reduce(
            (
              acc: Array<{
                merchant: { id: string; name: string; avatar?: string }
                items: MerchItem[]
              }>,
              item: MerchItem
            ) => {
              const existingMake = acc.find(
                (group) => group.merchant.id === item.merchant.id
              )

              if (existingMake) {
                existingMake.items.push(item)
              } else {
                acc.push({
                  merchant: {
                    id: item.merchant.id,
                    name: item.merchant.name,
                    avatar: item.merchant.avatar
                  },
                  items: [item]
                })
              }

              return acc
            },
            []
          )
          .map((itemsByMerchant) => (
            <div key={itemsByMerchant.merchant.id}>
              <div className='mt-6 flex space-x-1 lg:space-x-2 items-center'>
                <img
                  src={`${itemsByMerchant.merchant.avatar ?? '/man.svg'}`}
                  alt={itemsByMerchant.merchant.name}
                  className='h-12 lg:h-14 rounded-full mr-4'
                />

                <h2>{itemsByMerchant.merchant.name}</h2>
              </div>
              {itemsByMerchant.items.map((item) => (
                <Link
                  key={item.id}
                  href={`/produits/${item.id}`}
                  className='justify-between w-full flex items-center mt-4 shadow-md rounded bg-whiteopac hover:bg-whiteBGDarker text-sm lg:text-base text-blacklight'
                >
                  <div className='flex flex-row space-x-2 lg:space-x-4 items-center'>
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className='w-28 lg:w-40 h-[7rem] lg:h-[8rem] object-cover rounded flex-shrink-0'
                    />
                    <div className='flex flex-col h-[7rem] lg:h-[8rem] justify-between'>
                      <p className='font-semibold text-base lg:text-lg'>
                        {item.title}
                      </p>
                      <div className='flex flex-col'>
                        {item.price && (
                          <span className='font-semibold  text-base lg:text-lg'>
                            {item.price} dt
                          </span>
                        )}
                        <span className='italic text-blackopac2'>
                          {item.inStock ? 'En stock' : 'Rupture de stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ))}
      </div>
    </>
  )
}
