'use client'

import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { CarPost } from '../../../api/services/car-posts.service'
import { dotNumber } from '../../helpers'
import SpecList from '../car-specs/SpecList'
import CarPostUpdateModal from './CarPostUpdateModal'

const urlRegex = /(https?:\/\/[^\s]+)/g

const Linkify: React.FC<{ text: string }> = ({ text }) => {
  // Split the text by URLs and wrap URLs with <a> tags
  const parts = text.split(urlRegex).map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target='_blank'
          rel='noopener noreferrer'
          className='text-vividred underline'
        >
          {part.length > 25 ? part.slice(0, 25) + '...' : part}
        </a>
      )
    }
    return part
  })

  return <>{parts}</>
}

const Carousel: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fullScreenImage, setFullScreenImage] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const prevButtonRef = useRef<HTMLButtonElement>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)

  const nextImage = () =>
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  const prevImage = () =>
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    )

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        if (images.length === 1) {
          setFullScreenImage(false)
        } else if (
          // @ts-expect-error
          !prevButtonRef.current.contains(event.target) &&
          // @ts-expect-error
          !nextButtonRef.current.contains(event.target)
        ) {
          setFullScreenImage(false)
        }
      }
    }
    if (fullScreenImage) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [fullScreenImage])

  return (
    <div
      className='relative carousel rounded-lg'
      onClick={() => setFullScreenImage(true)}
    >
      <img
        src={images[currentIndex]}
        alt='Car image'
        className='mx-auto h-64 object-contain cursor-pointer'
      />
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className='absolute left-1 top-1/2 transform -translate-y-1/2 p-2 bg-blackopac2 hover:whiteopac rounded-full'
          >
            <img
              src='/arrow_prev.svg'
              alt='Image précédente'
              className='h-6 w-6'
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className='absolute right-1 top-1/2 transform -translate-y-1/2 p-2 bg-blackopac2 hover:whiteopac rounded-full'
          >
            <img
              src='/arrow_next.svg'
              alt='Image suivante'
              className='h-6 w-6'
            />
          </button>
        </>
      )}

      {fullScreenImage && (
        <div
          className='fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-40'
          onClick={() => setFullScreenImage(false)}
        >
          <div
            className='relative'
            ref={overlayRef}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                setFullScreenImage(false)
              }}
              className='absolute top-1 right-1 p-3 bg-black bg-opacity-20 hover:bg-opacity-50 rounded-full'
            >
              <img src='/close.svg' alt='Fermer' className='h-8 w-8 invert' />
            </button>
            <img
              src={images[currentIndex]}
              alt='Car image'
              className='object-contain max-h-[100dvh] max-w-full'
            />
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                ref={prevButtonRef}
                className='absolute left-1 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-20 hover:bg-opacity-50 rounded-full'
              >
                <img
                  src='/arrow_prev.svg'
                  alt='Image précédente'
                  className='h-8 w-8'
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                ref={nextButtonRef}
                className='absolute right-1 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-20 hover:bg-opacity-50 rounded-full'
              >
                <img
                  src='/arrow_next.svg'
                  alt='Image suivante'
                  className='h-8 w-8'
                />
              </button>{' '}
            </>
          )}
        </div>
      )}
    </div>
  )
}

type PostModalProps = {
  postId: string
  isFull?: boolean
  onClose?: () => void
}

const CarPostModal: React.FC<PostModalProps> = ({
  postId,
  onClose,
  isFull
}) => {
  const [post, setPost] = useState<CarPost | null | 'error'>(null)
  const [showModalUpdate, setShowModalUpdate] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const updateModalRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    try {
      fetch(`/api/car-post?postId=${postId}`, { next: { revalidate: 3600 } })
        .then((res) => res.json())
        .then((post) => {
          setPost(post)
        })
    } catch (e) {
      setPost('error')
    }
  }, [])

  // Close the modal if click is outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        (!updateModalRef.current ||
          !updateModalRef.current.contains(event.target as Node)) // Ignore clicks inside nested modal
      ) {
        if (onClose) onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const PostDetails = () => {
    const [showIA, setShowIA] = useState(false)

    const Infos = ({ post }: { post: CarPost }) => {
      return (
        <>
          <div className='flex justify-center space-x-4 items-center mt-4 mb-4 text-sm lg:text-base'>
            {post.merchant && (
              <Link
                href={`/${post.merchant.id}`}
                className='flex items-center space-x-1 p-2 lg:p-3 px-4 lg:px-8 rounded-xl font-semibold hover:bg-titan text-white bg-black bg-opacity-90 transition duration-300 ease-in-out'
              >
                <img src='/man.svg' alt='Vendeur' className='h-3 lg:h-4' />
                <span className='truncate max-w-[8rem] lg:max-w-[20rem]'>
                  {post.merchant.name}
                </span>
                {post.merchant.isShop && (
                  <img src='/badge.svg' className='h-3 lg:h-4' />
                )}
              </Link>
            )}
            {post.phone && (
              <a href={`tel:${post.phone}`} className=''>
                <button className='flex items-center space-x-1 p-2 lg:p-3 px-4 lg:px-8 rounded-xl font-semibold hover:bg-titan text-white bg-vividred transition duration-300 ease-in-out'>
                  <img
                    src='/phone.svg'
                    className='h-3 lg:h-4 invert'
                    alt='Appeler'
                  />
                  <span>Appeler</span>
                </button>
              </a>
            )}
            {post.phone && (
              <a
                href={`https://wa.me/${post.phone
                  .toString()
                  .replace(
                    '+',
                    ''
                  )}?text=Bonjour%2C%20cette%20annonce%20m%27int%C3%A9resse%20https%3A%2F%2Fautocentral.tn%2Fannonces%2F${
                  post.id
                }`}
              >
                <img
                  src='/whatsapp.svg'
                  className='h-[2.2rem] lg:h-[2.9rem]'
                  alt='Whatsapp'
                />
              </a>
            )}
          </div>
        </>
      )
    }

    return (
      <>
        {!post && (
          <div className='text-center text-lg lg:text-xl'>
            Chargement de l'annonce...
          </div>
        )}

        {post === 'error' && (
          <div className='text-center text-white'>
            <p>Impossible de récupérer les détails de l'annonce.</p>
          </div>
        )}

        {post && post !== 'error' && (
          <div>
            <div className='flex justify-between mb-4 items-start'>
              <button
                className='text-whiteBG cursor-none'
                onClick={() => {
                  setShowModalUpdate(true)
                }}
              >
                |
              </button>
              <h2 className='text-sm lg:text-xl font-bold w-full'>
                {post.title}
              </h2>
              {!isFull && (
                <button onClick={onClose} className='w-1/10'>
                  <img
                    src='/close.svg'
                    alt='Fermer'
                    className='h-6 lg:h-8 rounded hover:brightness-50'
                  />
                </button>
              )}
            </div>

            <Carousel images={post.images} />
            <Infos post={post} />
            <div className='mt-4 lg:mt-6 mb-4 flex flex-col mx-auto w-full text-center items-center text-2xl font-bold'>
              <span>
                {post.price ? dotNumber(post.price) + ' DT' : 'Prix N.C.'}
              </span>
              {post.estimatedPrice && (
                <div className='flex items-center space-x-1'>
                  <div
                    className={`w-[8px] h-[8px] lg:w-[10px] lg:h-[10px] rounded-full ${
                      post.estimatedPrice.color === 'GREEN'
                        ? 'bg-greenopac'
                        : post.estimatedPrice.color === 'RED'
                        ? 'bg-rolexgoldopac'
                        : 'bg-titanopac'
                    }`}
                  />
                  <span
                    className={`font-normal text-sm lg:text-lg italic ${
                      post.estimatedPrice.color === 'GREEN'
                        ? 'text-green'
                        : post.estimatedPrice.color === 'RED'
                        ? 'text-rolexgold'
                        : 'text-blackopac2'
                    }`}
                  >
                    {post.estimatedPrice.text}
                  </span>
                </div>
              )}
            </div>

            {!showIA && post.carEngine && (
              <button
                className='text-sm lg:text-base px-4 py-1 lg:py-2 flex space-x-1 items-center rounded-xl mx-auto bg-[#57b9ff] bg-opacity-90 text-white font-bold lg:my-6'
                onClick={() => setShowIA(true)}
              >
                <span>Voir le rapport autocentral.tn</span>
                <img src='/gears.svg' className='h-4' alt='Rapport technique' />
              </button>
            )}
            {showIA && <SpecList engine={post.carEngine!} tax={post.cvTax} />}

            <div className='shadow-lg rounded-lg mt-1 p-2 lg:p-6 lg:flex lg:justify-around'>
              <ul className='mt-1 text-sm lg:text-base'>
                {post.make && post.make !== 'Autres' && (
                  <li>
                    <strong>Modèle :</strong> {post.make} {post.model}
                  </li>
                )}
                <li>
                  <strong>Année :</strong> {post.year}
                </li>
                <li>
                  <strong>Kilométrage :</strong> {dotNumber(post.km) ?? '-'} km
                </li>
                <li>
                  <strong>Carburant :</strong> {post.fuel ?? '-'}
                </li>
                <li>
                  <strong>Boite :</strong> {post.gearbox ?? '-'}
                </li>
                <li>
                  <strong>Motorisation :</strong>{' '}
                  {post.engine ? post.engine + ' ' : ''}
                  {post.cv ? post.cv + ' cv' : ''}
                </li>
                <li>
                  <strong>Région :</strong> {post.region.name}
                </li>
                <li className='underline'>
                  <a
                    href={post.urlSource}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <strong>Source :</strong> {post.source} -{' '}
                    {post.publishedAtText}
                  </a>
                </li>
              </ul>

              {post.description && (
                <div className='mt-2 lg:mt-0'>
                  <span className='font-semibold'>
                    Description du vendeur :
                  </span>
                  <p className='text-sm lg:text-base lg:max-w-[600px]'>
                    {post.description.split('\n').map((line, index) => (
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

            <Infos post={post} />
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
            <PostDetails />
          </div>
        </div>
      )}
      {isFull && <PostDetails />}
      {showModalUpdate && post !== 'error' && (
        <CarPostUpdateModal
          ref={updateModalRef}
          onClose={setShowModalUpdate}
          carData={{
            id: post?.id,
            km: post?.km,
            year: post?.year,
            price: post?.price,
            estimation: post?.estimatedPrice?.value,
            make: post?.make,
            model: post?.model
          }}
        />
      )}
    </div>
  )
}

export default CarPostModal
