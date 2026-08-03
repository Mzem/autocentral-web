'use client'

import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons'
import {
  faXmark,
  faCircleCheck,
  faCircleXmark
} from '@fortawesome/free-solid-svg-icons'
import { MerchItem } from '../../api/services/merch-items.service'
import { dotNumber } from '../helpers'
import { Linkify } from '../Linkify'
import { Carousel } from './Carousel'
import ShareButton from './Share'
import { messengerOrderUrl } from '../_lib/merch'

type MerchItemModalProps = {
  item: MerchItem
  isFull?: boolean
  onClose?: () => void
}

const MerchItemModal: React.FC<MerchItemModalProps> = ({
  item,
  isFull,
  onClose
}) => {
  const [isFullImage, setIsFullImage] = useState(false)

  const Details = () => (
    <div className='text-ink-950'>
      <h1 className='pr-10 text-lg font-extrabold tracking-tight lg:text-2xl'>
        {item.title}
      </h1>

      <div className='mt-4'>
        <Carousel images={item.images} setIsFullImage={setIsFullImage} />
      </div>

      <div className='mt-5 flex flex-wrap items-center justify-between gap-3'>
        <span className='text-2xl font-extrabold lg:text-3xl'>
          {item.price ? `${dotNumber(item.price)} DT` : 'Prix N.C.'}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-semibold ${
            item.inStock
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-danger/10 text-danger'
          }`}
        >
          <FontAwesomeIcon
            icon={item.inStock ? faCircleCheck : faCircleXmark}
            className='h-3.5 w-3.5'
          />
          {item.inStock ? 'En stock' : 'Rupture de stock'}
        </span>
      </div>

      <a
        href={messengerOrderUrl(item)}
        target='_blank'
        rel='noopener noreferrer'
        className='mt-4 flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#1877F2] px-5 py-3 text-base font-bold text-white shadow-lg shadow-[#1877F2]/25 transition-colors hover:bg-[#0f66d0]'
      >
        <FontAwesomeIcon icon={faFacebookMessenger} className='h-5 w-5' />
        Commander sur Messenger
      </a>

      {item.description && (
        <div className='mt-5 rounded-xl bg-ink-50 p-4 text-sm text-ink-700 lg:text-base'>
          {item.description.split('\n').map((line, index) => (
            <span key={index}>
              <Linkify text={line.charAt(0).toUpperCase() + line.slice(1)} />
              <br />
            </span>
          ))}
        </div>
      )}

      <div className='mt-5 flex items-center justify-center'>
        <ShareButton
          label
          className='rounded-lg border border-ink-200 px-4 py-2 text-ink-700 transition-colors hover:bg-ink-50'
        />
      </div>
    </div>
  )

  if (isFull) return <>{Details()}</>

  return (
    <div
      className='fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-3'
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className='relative max-h-[90vh] w-[98%] max-w-2xl overflow-y-auto rounded-lg bg-white p-4 shadow-2xl lg:p-6'
      >
        {!isFullImage && (
          <button
            type='button'
            aria-label='Fermer'
            onClick={onClose}
            className='absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-ink-100 text-ink-600 transition-colors hover:bg-ink-200'
          >
            <FontAwesomeIcon icon={faXmark} className='h-4 w-4' />
          </button>
        )}
        {Details()}
      </div>
    </div>
  )
}

export default MerchItemModal
