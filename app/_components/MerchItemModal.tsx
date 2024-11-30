'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MerchItem } from '../../api/services/merch-items.service'
import { dotNumber } from '../helpers'
import { Linkify } from '../Linkify'
import { Carousel } from './Carousel'
import ShareButton from './Share'
import { InfoCard } from './InfoCard'
import Link from 'next/link'

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
  const modalRef = useRef<HTMLDivElement | null>(null)

  // Close the modal if click is outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) // Ignore clicks inside nested modal
      ) {
        if (onClose) onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const Details = () => {
    const [isFullImage, setIsFullImage] = useState(false)

    const Infos = ({ item }: { item: MerchItem }) => {
      return (
        <>
          <div className='flex justify-around sm:justify-center sm:space-x-4 items-center mt-4 mb-4 text-sm md:text-base'>
            {item.merchant && (
              <Link
                href={`/produits#${item.merchant.id}`}
                className='flex items-center space-x-1 p-2 lg:p-3 px-3 lg:px-8 rounded-xl font-semibold hover:bg-titan text-white bg-black bg-opacity-90 transition duration-300 ease-in-out'
                onClick={() => {
                  if (onClose !== undefined) onClose()
                }}
              >
                <img src='/man.svg' alt='Vendeur' className='h-3 md:h-4' />
                <span className='truncate xs:max-w-[4.5rem] max-w-[6.5rem] md:max-w-[15rem]'>
                  {item.merchant.name}
                </span>
                {item.merchant.isShop && (
                  <img src='/badge.svg' className='h-3 md:h-4' />
                )}
              </Link>
            )}
            {item.merchant.phone && item.merchant.phone !== '+21699999999' && (
              <a href={`tel:${item.merchant.phone}`} className=''>
                <button className='flex items-center space-x-1 p-2 lg:p-3 lg:px-8 rounded-xl font-semibold hover:bg-titan text-white bg-vividred transition duration-300 ease-in-out'>
                  <img
                    src='/phone.svg'
                    className='h-3 lg:h-4 invert'
                    alt='Appeler'
                  />
                  <span>
                    {dotNumber(
                      item.merchant.phone.toString().replace('+216', '')
                    )}
                  </span>
                </button>
              </a>
            )}
            {item.merchant.phone && item.merchant.phone !== '+21699999999' && (
              <a
                href={`https://wa.me/${item.merchant.phone
                  .toString()
                  .replace(
                    '+',
                    ''
                  )}?text=Bonjour%2C%20cette%20annonce%20m%27int%C3%A9resse%20https%3A%2F%2Fautocentral.tn%2Fannonces%2F${
                  item.merchant.id
                }`}
              >
                <img
                  src='/whatsapp.svg'
                  className='xs:h-[2rem] h-[2.2rem] md:h-[2.5rem] lg:h-[2.9rem]'
                  alt='Whatsapp'
                />
              </a>
            )}
            <ShareButton />
          </div>
        </>
      )
    }

    return (
      <>
        {!isFull && !isFullImage && (
          <button
            onClick={onClose}
            className={`w-1/10 fixed right-[4%] lg:right-[23%] rounded-full bg-blackopac2 p-1 z-50`}
          >
            <img
              src='/close.svg'
              alt='Fermer'
              className='h-6 lg:h-8 rounded hover:brightness-50 invert'
            />
          </button>
        )}
        {!item && (
          <>
            <div className='text-center text-lg lg:text-xl'>
              Offre expirée...
            </div>
          </>
        )}

        {item && (
          <div>
            <div className={`flex justify-between mb-4 items-start `}>
              <h2
                className={`text-sm lg:text-xl font-bold w-full ${
                  isFull ? '' : 'mr-[10%]'
                }`}
              >
                {item.title}
              </h2>
            </div>

            <Carousel images={item.images} setIsFullImage={setIsFullImage} />
            <Infos item={item} />
            <div className='mt-4 lg:mt-6 mb-3 lg:mb-4 flex flex-col mx-auto w-full text-center items-center text-2xl font-bold'>
              <div className='flex items-center space-x-1'>
                <span className={`ml-2 lg:ml-4`}>
                  {item.price ? dotNumber(item.price) + ' DT' : 'Prix N.C.'}
                </span>
              </div>
            </div>

            <a
              href={item.urlSource}
              target='_blank'
              rel='noopener noreferrer'
              className='flex justify-center w-full mx-auto'
            >
              <InfoCard img='/external.svg' title='Commander' value={``} />
            </a>

            <div className='shadow-lg rounded-lg mt-1 p-2 lg:p-6 lg:flex lg:justify-around'>
              {item.description && (
                <div className='mt-4 lg:mt-0 bg-whiteBG rounded-lg shadow p-2'>
                  <p className='text-sm lg:text-base lg:max-w-[600px]'>
                    {item.description.split('\n').map((line, index) => (
                      <span key={index}>
                        <Linkify
                          text={line.charAt(0).toUpperCase() + line.slice(1)}
                        />
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </div>

            <Infos item={item} />
          </div>
        )}
      </>
    )
  }

  return (
    <div className='text-black'>
      {!isFull && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30'>
          <div
            ref={modalRef}
            className='bg-whiteBG p-2 lg:p-4 border border-whiteopac rounded w-[98%] lg:w-7/12 h-[76%] overflow-y-scroll'
          >
            <Details />
          </div>
        </div>
      )}
      {isFull && <Details />}
    </div>
  )
}

export default MerchItemModal
