'use client'

import { Merchant } from '../../api/services/merchants.service'
import { dotNumber } from '../helpers'

type MerchantHeaderProps = {
  merchant: Merchant
}

function MerchantHeader({ merchant }: MerchantHeaderProps) {
  return (
    <div className='flex flex-col  space-y-4 mt-2 mx-auto justify-between text-black'>
      {/* Logo and Shop Name */}
      <div className='flex flex-row items-center justify-between'>
        <div className='flex space-x-4 items-center'>
          <img
            src={`${merchant.avatar ? merchant.avatar : '/man.svg'}`}
            className={`max-w-28 w-28 lg:max-w-32 lg:w-32 max-h-[5rem] lg:max-h-[9rem] rounded-lg object-cover flex-shrink-0  ${
              !merchant.avatar ? 'invert' : ''
            }`}
          />
          <p className='text-xl lg:text-3xl'>{merchant.name}</p>
        </div>
        <div className='hidden md:flex md:flex-row items-center space-x-16'>
          <div className='flex flex-col items-center'>
            <img src='/speed.svg' alt='Annonces' className='h-5' />
            <p className=''>{merchant.count} annonces</p>
          </div>

          {(merchant.fb || merchant.insta) && (
            <div className='flex flex-col items-center space-y-2 mt-4'>
              {merchant.fb && (
                <a href={merchant.fb} target='_blank' rel='noopener noreferrer'>
                  <img
                    src='/facebook.svg'
                    alt='Facebook'
                    className='h-5 w-5 hover:text-white hover:brightness-50'
                  />
                </a>
              )}
              {merchant.insta && (
                <a
                  href={merchant.insta}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <img
                    src='/instagram.svg'
                    alt='Instagram'
                    className='h-5 w-5 hover:text-white hover:brightness-50'
                  />
                </a>
              )}
            </div>
          )}
          {merchant.regionName && (
            <a
              href={merchant.gmapsLink ?? undefined}
              target='_blank'
              className='flex flex-col items-center'
            >
              <img src='/location.svg' className='h-5' />
              <p className='text-l mt-1'>{merchant.regionName}</p>
              {merchant.gmapsLink && <p className='text-xs underline'>GPS</p>}
            </a>
          )}
          {merchant.phone && (
            <a
              href={`tel:${merchant.phone.trim()}`}
              className='flex flex-col items-center hover:underline'
            >
              <img src='/phone.svg' className='h-5' />
              <p className='text-sm mt-1'>Appeler</p>
              <p className='text-sm font-bold'>
                {dotNumber(merchant.phone.replace('+216', ''))}
              </p>
            </a>
          )}
        </div>
      </div>
      <div className='md:hidden flex flex-row items-center justify-around'>
        <div className='flex flex-col items-center'>
          <img src='/speed.svg' alt='Annonces' className='h-5' />
          <p className='xs:text-xs'>{merchant.count} annonces</p>
        </div>

        {(merchant.fb || merchant.insta) && (
          <div className='flex flex-col items-center space-y-2 mt-4'>
            {merchant.fb && (
              <a href={merchant.fb} target='_blank' rel='noopener noreferrer'>
                <img
                  src='/facebook.svg'
                  alt='Facebook'
                  className='h-5 w-5 hover:text-white hover:brightness-50'
                />
              </a>
            )}
            {merchant.insta && (
              <a
                href={merchant.insta}
                target='_blank'
                rel='noopener noreferrer'
              >
                <img
                  src='/instagram.svg'
                  alt='Instagram'
                  className='h-5 w-5 hover:text-white hover:brightness-50'
                />
              </a>
            )}
          </div>
        )}
        {merchant.regionName && (
          <a
            href={merchant.gmapsLink ?? undefined}
            target='_blank'
            className={`flex flex-col items-center ${
              merchant.gmapsLink ? 'cursor-pointer' : ''
            }`}
          >
            <img src='/location.svg' className='h-5' />
            <p className='text-l mt-1'>{merchant.regionName}</p>
            {merchant.gmapsLink && <p className='text-xs underline'>GPS</p>}
          </a>
        )}
        {merchant.phones && merchant.phones.length === 1 && (
          <div className='text-sm xs:text-xs'>
            <a href={`tel:${merchant.phones[0]}`} className=''>
              <button className='flex items-center space-x-1 py-1 px-2 lg:px-8 rounded-xl font-semibold hover:bg-titan text-white bg-vividred transition duration-300 ease-in-out'>
                <img
                  src='/phone.svg'
                  className='h-3 lg:h-4 invert'
                  alt='Appeler'
                />
                <span>
                  {dotNumber(merchant.phones[0].toString().replace('+216', ''))}
                </span>
              </button>
            </a>
          </div>
        )}
        {merchant.phones && merchant.phones.length >= 2 && (
          <div className='text-sm xs:text-xs'>
            <a href={`tel:${merchant.phones[0]}`} className=''>
              <button className='flex items-center space-x-1 mb-[2px] px-2 lg:px-8 rounded-xl font-semibold hover:bg-titan text-white bg-vividred transition duration-300 ease-in-out'>
                <img
                  src='/phone.svg'
                  className='h-3 lg:h-4 invert'
                  alt='Appeler'
                />
                <span>
                  {dotNumber(merchant.phones[0].toString().replace('+216', ''))}
                </span>
              </button>
            </a>
            <a href={`tel:${merchant.phones[1]}`} className=''>
              <button className='flex items-center space-x-1 px-2 lg:px-8 rounded-xl font-semibold hover:bg-titan text-white bg-vividred transition duration-300 ease-in-out'>
                <img
                  src='/phone.svg'
                  className='h-3 lg:h-4 invert'
                  alt='Appeler'
                />
                <span>
                  {dotNumber(merchant.phones[1].toString().replace('+216', ''))}
                </span>
              </button>
            </a>
          </div>
        )}
      </div>
      {merchant.description && merchant.address !== merchant.description && (
        <div className='text-sm xs:text-xs'>{merchant.description}</div>
      )}
      {(merchant.address || merchant.regionDetail) && (
        <a
          className={`text-xs flex ${
            merchant.gmapsLink ? 'cursor-pointer' : ''
          }`}
          href={merchant.gmapsLink ?? undefined}
          target='_blank'
        >
          <img src='/location.svg' alt='Adresse' className='h-3 mt-[2px]' />
          {merchant.regionDetail ? merchant.regionDetail + ' ' : ''}
          {merchant.address ? merchant.address + ' ' : ''}
        </a>
      )}
    </div>
  )
}

export default MerchantHeader
