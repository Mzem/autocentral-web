'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStore,
  faPhone,
  faLocationDot
} from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons'
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
    <div className='flex flex-row flex-wrap mx-auto lg:items-center justify-between text-white'>
      {/* Logo and Shop Name */}
      <div className='flex flex-row items-center space-x-4 lg:space-x-20'>
        {avatar || hasLogo ? (
          <img
            src={avatar ? avatar : '/' + id + '/logo.jpg'}
            alt={name}
            className={`max-w-28 w-28 lg:max-w-32 lg:w-32 max-h-[5rem] lg:max-h-[9rem] rounded-lg object-cover flex-shrink-0 ${
              small ? 'h-16 w-16 border-ink-950' : ''
            }`}
          />
        ) : (
          <div
            className={`flex items-center justify-center rounded-lg bg-surface flex-shrink-0 ${
              small ? 'h-16 w-16' : 'h-20 w-20 lg:h-28 lg:w-28'
            }`}
          >
            <FontAwesomeIcon
              icon={faStore}
              className='h-8 w-8 lg:h-10 lg:w-10 text-white/70'
            />
          </div>
        )}
        <p className='text-xl lg:text-3xl'>{name}</p>
      </div>

      {/* Contact Information */}
      <div className='mt-4 lg:mt-0 flex lg:flex-row items-center space-x-4 lg:space-x-16'>
        {phone && (
          <a
            href={`tel:${phone.trim()}`}
            className='flex flex-col items-center hover:underline'
          >
            <FontAwesomeIcon icon={faPhone} className='h-5 w-5' />
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
            <FontAwesomeIcon icon={faLocationDot} className='h-5 w-5' />
            <p className='text-l mt-1'>Localisation</p>
          </a>
        )}
      </div>

      {/* Social Media Icons */}
      <div className='flex flex-col items-center space-y-1 lg:space-y-2 mt-4 lg:mt-0'>
        {fb && (
          <a href={fb} target='_blank' rel='noopener noreferrer'>
            <FontAwesomeIcon
              icon={faFacebookF}
              className='h-5 w-5 transition hover:opacity-60'
            />
          </a>
        )}
        {insta && (
          <a href={insta} target='_blank' rel='noopener noreferrer'>
            <FontAwesomeIcon
              icon={faInstagram}
              className='h-5 w-5 transition hover:opacity-60'
            />
          </a>
        )}
      </div>
    </div>
  )
}

export default ShopHeader
