import Link from 'next/link'
import { getMerchants } from '../../api/services/merchants.service'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: 'https://autocentral.tn/vendeurs'
    }
  }
}

export default async function Merchants() {
  const merchants = await getMerchants(true)

  return (
    <>
      <div className='text-center text-base lg:text-2xl mt-9 lg:mt-20 text-black flex items-center space-x-2 ml-[2px]'>
        <p>Showrooms & Vendeurs PRO</p>
        <img src='/badge.svg' className='h-4 lg:h-5' />
      </div>
      {/* <a
        href={`https://wa.me/216XXXXXXXX?text=Pour%20d%C3%A9poser%20une%20annonce%3A%20Mod%C3%A8le%2C%20Ann%C3%A9e%2C%20Kilom%C3%A9trage%2C%20Prix%2C%20Photos`}
        className='w-auto mt-2 rounded-lg bg-blackopac2 inline-flex text-white text-xs sm:text-sm items-center space-x-1 py-[2px] px-[6px] mb-7 lg:mb-16'
      >
        <p>Pour créer votre espace, veuillez nous contacter</p>
        <img src='/whatsapp_white.svg' className='h-[1rem]' alt='Whatsapp' />
      </a> */}

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
