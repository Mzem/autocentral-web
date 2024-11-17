'use client'

import { dotNumber } from '../helpers'

type ShopHeaderProps = {
  id: string
  name: string
  phone?: string
  phoneText?: 'RDV' | 'COMMAND'
  location?: string
  fb?: string
  insta?: string
  small?: boolean
  hasLogo?: boolean
  avatar?: string
}

function ShopHeader({
  id,
  name,
  phone,
  phoneText,
  location,
  fb,
  insta,
  small,
  hasLogo,
  avatar
}: ShopHeaderProps) {
  return (
    <div className='flex flex-row flex-wrap mx-auto items-center justify-between text-black'>
      {/* Logo and Shop Name */}
      <div className='flex flex-row items-center space-x-8 lg:space-x-20'>
        <img
          src={`${
            avatar ? avatar : hasLogo ? '/' + id + '/logo.jpg' : '/man.svg'
          }`}
          className={`max-w-28 w-28 lg:max-w-32 lg:w-32 max-h-[5rem] lg:max-h-[9rem] rounded object-cover flex-shrink-0  ${
            small ? 'h-16 w-16 border-blackopac' : ''
          } ${!avatar && !hasLogo ? 'invert' : ''}`}
        />
        <p className='text-xl lg:text-3xl'>{name}</p>
      </div>

      {/* Contact Information */}
      <div className='mt-4 lg:mt-0 flex lg:flex-row items-center space-x-4 lg:space-x-16'>
        {phone && (
          <a
            href={`tel:${phone.trim()}`}
            className='flex flex-col items-center hover:underline'
          >
            <img src='/phone.svg' className='h-5' />
            <p className='text-sm mt-1'>
              {phoneText === 'RDV'
                ? 'Prendre rendez-vous'
                : phoneText === 'COMMAND'
                ? 'Passer une commande'
                : 'Appeler'}
            </p>
            <p className='text-sm font-bold'>
              {dotNumber(phone.replace('+216', ''))}
            </p>
          </a>
        )}

        {/* Location Link */}
        {location && (
          <a
            href={location}
            className='flex flex-col items-center hover:underline'
          >
            <img src='/location.svg' className='h-5' />
            <p className='text-l mt-1'>Localisation</p>
          </a>
        )}
      </div>

      {/* Social Media Icons */}
      <div className='flex flex-col items-center space-y-1 lg:space-y-2 mt-4 lg:mt-0'>
        {fb && (
          <a href={fb} target='_blank' rel='noopener noreferrer'>
            <img
              src='/facebook.svg'
              alt='Facebook'
              className='h-5 w-5 hover:text-white hover:brightness-50'
            />
          </a>
        )}
        {insta && (
          <a href={insta} target='_blank' rel='noopener noreferrer'>
            <img
              src='/instagram.svg'
              alt='Instagram'
              className='h-5 w-5 hover:text-white hover:brightness-50'
            />
          </a>
        )}
      </div>
    </div>
  )
}

export default ShopHeader
