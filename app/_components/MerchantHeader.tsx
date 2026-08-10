'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons'
import {
  faCar,
  faCircleCheck,
  faLocationDot,
  faPhone,
  faStore
} from '@fortawesome/free-solid-svg-icons'
import { Merchant } from '../../api/services/merchants.service'
import { dotNumber } from '../helpers'

type MerchantHeaderProps = {
  merchant: Merchant
}

export default function MerchantHeader({ merchant }: MerchantHeaderProps) {
  const phones = merchant.phones ?? (merchant.phone ? [merchant.phone] : [])

  return (
    <div className='mt-2 flex flex-col gap-4 text-white'>
      <div className='flex flex-wrap items-center gap-4'>
        {merchant.avatar ? (
          <img
            src={merchant.avatar}
            alt={merchant.name}
            className='h-24 w-24 shrink-0 rounded-xl object-cover lg:h-28 lg:w-28'
          />
        ) : (
          <span className='flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 lg:h-28 lg:w-28'>
            <FontAwesomeIcon icon={faStore} className='h-10 w-10' />
          </span>
        )}

        <div className='min-w-0 flex-1'>
          <h1 className='flex items-center gap-2 text-xl font-extrabold tracking-tight lg:text-3xl'>
            {merchant.name}
            {merchant.isShop && (
              <FontAwesomeIcon
                icon={faCircleCheck}
                className='h-5 w-5 text-brand-400'
              />
            )}
          </h1>

          <div className='mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-300'>
            <span className='inline-flex items-center gap-1.5'>
              <FontAwesomeIcon
                icon={faCar}
                className='h-4 w-4 text-brand-400'
              />
              {merchant.count} annonces
            </span>

            {merchant.regionName && (
              <a
                href={merchant.gmapsLink ?? undefined}
                target='_blank'
                rel='noopener noreferrer'
                className={`inline-flex items-center gap-1.5 ${
                  merchant.gmapsLink ? 'hover:text-white' : ''
                }`}
              >
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className='h-4 w-4 text-brand-400'
                />
                {merchant.regionName}
                {merchant.gmapsLink && (
                  <span className='text-xs underline'>GPS</span>
                )}
              </a>
            )}

            {merchant.fb && (
              <a
                href={merchant.fb}
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Facebook'
                className='flex h-8 w-8 items-center justify-center rounded-full bg-[#1877F2] text-white transition-opacity hover:opacity-90'
              >
                <FontAwesomeIcon icon={faFacebookF} className='h-4 w-4' />
              </a>
            )}
            {merchant.insta && (
              <a
                href={merchant.insta}
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Instagram'
                className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white transition-opacity hover:opacity-90'
              >
                <FontAwesomeIcon icon={faInstagram} className='h-4 w-4' />
              </a>
            )}
          </div>
        </div>

        {phones.length > 0 && (
          <div className='flex shrink-0 flex-col gap-1.5'>
            {phones.slice(0, 2).map((phone) => (
              <a
                key={phone}
                href={`tel:${phone}`}
                className='inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500'
              >
                <FontAwesomeIcon icon={faPhone} className='h-3.5 w-3.5' />
                {dotNumber(phone.toString().replace('+216', ''))}
              </a>
            ))}
          </div>
        )}
      </div>

      {merchant.description && merchant.address !== merchant.description && (
        <p className='text-sm leading-relaxed text-ink-300'>
          {merchant.description}
        </p>
      )}

      {(merchant.address || merchant.regionDetail) && (
        <a
          href={merchant.gmapsLink ?? undefined}
          target='_blank'
          rel='noopener noreferrer'
          className={`inline-flex items-start gap-1.5 text-xs text-ink-400 ${
            merchant.gmapsLink ? 'hover:text-white' : ''
          }`}
        >
          <FontAwesomeIcon
            icon={faLocationDot}
            className='mt-0.5 h-3 w-3 shrink-0 text-brand-400'
          />
          <span>
            {merchant.regionDetail ? merchant.regionDetail + ' ' : ''}
            {merchant.address ?? ''}
          </span>
        </a>
      )}
    </div>
  )
}
