'use client'

type ShopHeaderProps = {
  id: string
  name: string
  phone: string
  phoneText?: 'RDV' | 'COMMAND'
  location?: string
  fb?: string
  insta?: string
}

function ShopHeader({
  id,
  name,
  phone,
  phoneText,
  location,
  fb,
  insta
}: ShopHeaderProps) {
  return (
    <div className='flex flex-row flex-wrap mx-auto w-3/4 items-center justify-between'>
      {/* Logo and Shop Name */}
      <div className='flex flex-row items-center space-x-8 lg:space-x-24'>
        <img
          src={`${id}/logo.jpg`}
          className='h-20 w-20 rounded-full object-cover border-2 border-white'
        />
        <p className='text-xl lg:text-3xl'>{name}</p>
      </div>

      {/* Contact Information */}
      <div className='mt-4 lg:mt-0 flex lg:flex-row items-center space-x-6 lg:space-x-16'>
        <a
          href={`tel:00216${phone.trim()}`}
          className='flex flex-col items-center'
        >
          <img src='/phone.svg' className='h-5' />
          <p className='text-sm mt-1'>
            {phoneText === 'RDV'
              ? 'Prendre rendez-vous'
              : phoneText === 'COMMAND'
              ? 'Passer une commande'
              : 'Appeler'}
          </p>
          <p className='text-sm font-bold'>{phone}</p>
        </a>

        {/* Location Link */}
        {location && (
          <a href={location} className='flex flex-col items-center'>
            <img src='/location.svg' className='h-5' />
            <p className='text-l mt-1'>Localisation</p>
          </a>
        )}
      </div>

      {/* Social Media Icons */}
      <div className='flex flex-col items-center space-y-1 lg:space-y-2 mt-4 lg:mt-0'>
        {fb && (
          <a href={fb} target='_blank' rel='noopener noreferrer'>
            <img src='/facebook.svg' alt='Facebook' className='h-5 w-5' />
          </a>
        )}
        {insta && (
          <a href={insta} target='_blank' rel='noopener noreferrer'>
            <img src='/instagram.svg' alt='Instagram' className='h-5 w-5' />
          </a>
        )}
      </div>
    </div>
  )
}

export default ShopHeader
