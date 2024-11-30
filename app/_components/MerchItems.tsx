'use client'

import { useState } from 'react'
import { MerchItem } from '../../api/services/merch-items.service'
import MerchItemModal from './MerchItemModal'

export const MerchItems = ({ merchItems }: { merchItems: MerchItem[] }) => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  return (
    <>
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
            <div
              key={itemsByMerchant.merchant.id}
              id={itemsByMerchant.merchant.id}
            >
              <div className='mt-6 flex space-x-1 lg:space-x-2 items-center'>
                <img
                  src={`${itemsByMerchant.merchant.avatar ?? '/man.svg'}`}
                  alt={itemsByMerchant.merchant.name}
                  className='h-12 lg:h-14 rounded-full mr-4'
                />

                <h2>{itemsByMerchant.merchant.name}</h2>
              </div>
              {itemsByMerchant.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedPostId(item.id)
                    window.history.pushState(null, '', `/produits/${item.id}`)
                  }}
                  className='justify-between w-full flex items-center mt-4 shadow-md rounded bg-whiteopac hover:bg-whiteBGDarker text-sm lg:text-base text-blacklight'
                >
                  <div className='flex flex-row space-x-2 lg:space-x-4'>
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className='w-28 lg:w-40 h-[7rem] lg:h-[8rem] object-cover rounded flex-shrink-0'
                    />
                    <div className='flex flex-col h-[7rem] lg:h-[8rem] justify-between text-left'>
                      {' '}
                      {/* Ensure text-left here */}
                      <p className='font-semibold text-sm lg:text-base'>
                        {item.title}
                      </p>
                      <div className='flex flex-col'>
                        <span className='font-semibold text-sm lg:text-base'>
                          {item.price ? `${item.price} DT` : 'Prix N.C'}
                        </span>

                        <span className='italic text-blackopac2 text-xs lg:text-sm'>
                          {item.inStock ? 'En stock' : 'Rupture de stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ))}
      </div>

      {selectedPostId && (
        <MerchItemModal
          item={merchItems.find((item) => item.id === selectedPostId)!}
          onClose={() => {
            setSelectedPostId(null)
            window.history.replaceState(null, '', '/produits')
          }}
        />
      )}
    </>
  )
}
