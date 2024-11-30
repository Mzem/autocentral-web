import { Metadata } from 'next'
import Link from 'next/link'
import { getMerchItems } from '../../api/services/merch-items.service'

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: 'https://autocentral.tn/boutique'
    }
  }
}

export default async function Merchants() {
  const merchItems = await getMerchItems()

  return (
    <>
      <div className='text-center text-base lg:text-2xl mt-9 lg:mt-20 text-black flex items-center space-x-2 ml-[2px] mb-8'>
        <p>Boutique & Produits dérivés</p>
        <img src='/race_flag.svg' className='h-4 lg:h-5 invert' />
      </div>

      <div className='w-full mx-auto text-black'>
        {merchItems.map((item) => (
          <Link
            key={item.id}
            href={`/produits/${item.id}`}
            className='justify-between w-full flex items-center mt-4 shadow-md rounded bg-whiteopac hover:bg-whiteBGDarker text-xs lg:text-sm text-blacklight'
          >
            <div className='flex flex-row space-x-2 lg:space-x-4 items-center'>
              <img
                src={item.image}
                alt={item.title}
                className='w-28 lg:w-40 h-[7.5rem] lg:h-[8.5rem] object-cover rounded flex-shrink-0'
              />
              <div className='flex flex-col h-[7.5rem] lg:h-[8.5rem]'>
                <p className='font-bold text-base lg:text-lg'>{item.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
