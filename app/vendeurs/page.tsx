import Link from 'next/link'
import { getMerchants } from '../../api/services/merchants.service'

export default async function Merchants() {
  const merchants = await getMerchants(true)

  return (
    <>
      <div className='text-center text-base lg:text-2xl mt-9 lg:mt-20 text-black mb-7 lg:mb-16 flex items-center space-x-2'>
        <p>Showrooms & Vendeurs professionnels</p>
        <img src='/badge.svg' className='h-4 lg:h-5' />
      </div>

      <div className='w-full mx-auto text-black'>
        {merchants.map((merchant) => (
          <Link
            key={merchant.id}
            href={`/${merchant.id}`}
            className='justify-between w-full flex items-center mt-4 shadow-md rounded bg-whiteopac hover:bg-whiteBGDarker text-xs lg:text-sm text-blacklight'
          >
            <div className='flex flex-row space-x-2 lg:space-x-4 items-center'>
              {merchant.avatar && (
                <img
                  src={merchant.avatar}
                  alt={merchant.name}
                  className='max-w-32 w-32 max-h-[9rem] rounded object-cover flex-shrink-0'
                />
              )}
              {!merchant.avatar && (
                <img
                  src='/man.svg'
                  alt={merchant.name}
                  className='max-w-32 w-32 max-h-[9rem] rounded object-cover flex-shrink-0 invert'
                />
              )}
              <div className='flex flex-col h-[7.5rem] lg:h-[8.5rem]'>
                <p className='font-bold text-base lg:text-lg'>
                  {merchant.name}
                </p>
                <div className='flex items-center mt-1'>
                  <img
                    src='/location.svg'
                    alt='Gouvernorat'
                    className='h-3 lg:h-4 mr-1'
                  />
                  <span>{merchant.regionName}</span>

                  <span className='text-titan mx-2'>|</span>
                  <img
                    src='/speed.svg'
                    alt='Annonces'
                    className='h-3 lg:h-4 mr-1'
                  />
                  <span className='font-medium'>{merchant.count} annonces</span>
                </div>

                <p className='overflow-hidden mt-2'>{merchant.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
