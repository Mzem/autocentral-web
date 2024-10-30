'use client'

import React, { useEffect, useRef, useState } from 'react'
import { CarPost } from '../../../api/services/car-posts.service'

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
        !overlayRef.current.contains(event.target as Node) &&
        // @ts-expect-error
        !prevButtonRef.current.contains(event.target) &&
        // @ts-expect-error
        !nextButtonRef.current.contains(event.target)
      ) {
        setFullScreenImage(false)
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
      <button
        onClick={(e) => {
          e.stopPropagation()
          prevImage()
        }}
        className='absolute left-1 top-1/2 transform -translate-y-1/2 p-2 bg-blackopac2 hover:whiteopac rounded-full'
      >
        <img src='/arrow_prev.svg' alt='Image précédente' className='h-6 w-6' />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          nextImage()
        }}
        className='absolute right-1 top-1/2 transform -translate-y-1/2 p-2 bg-blackopac2 hover:whiteopac rounded-full'
      >
        <img src='/arrow_next.svg' alt='Image suivante' className='h-6 w-6' />
      </button>

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
          </button>
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
  const modalRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    try {
      fetch(`/api/car-post?postId=${postId}`)
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
        !modalRef.current.contains(event.target as Node)
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

            {post.description && (
              <p className='mt-4 text-sm lg:text-base'>
                {post.description.split('\n').map((line, index) => (
                  <span key={index}>
                    <Linkify
                      text={line.charAt(0).toUpperCase() + line.slice(1)}
                    />
                    <br />
                  </span>
                ))}
              </p>
            )}
            <ul className='mt-4 text-sm lg:text-base'>
              <li>
                <strong>Modèle :</strong> {post.make} {post.model}
              </li>
              <li>
                <strong>Année :</strong> {post.year}
              </li>
              <li>
                <strong>Prix :</strong> {post.price ?? '-'} TND
              </li>
              <li>
                <strong>Kilométrage :</strong> {post.km ?? '-'} km
              </li>
              <li>
                <strong>Carburant:</strong> {post.fuel ?? '-'}
              </li>
              <li>
                <strong>Boite :</strong> {post.gearbox ?? '-'}
              </li>
              <li>
                <strong>Transmission :</strong> {post.transmission ?? '-'}
              </li>
              <li>
                <strong>Région :</strong> {post.region.name}
              </li>
              <li>
                <strong>Vendeur :</strong> {post.merchant.name}
              </li>
            </ul>
            {post.phone && (
              <a
                href={`tel:${post.phone}`}
                className='w-full flex mx-auto mt-4'
              >
                <button className='mx-auto p-3 px-6 rounded-xl font-semibold hover:bg-titan text-white bg-blackopac transition duration-300 ease-in-out mb-3'>
                  Appeler le vendeur
                </button>
              </a>
            )}
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
            className='bg-whiteBG p-8 border border-whiteopac rounded w-[98%] lg:w-5/12 h-[76%] overflow-y-scroll'
          >
            <PostDetails />
          </div>
        </div>
      )}
      {isFull && <PostDetails />}
    </div>
  )
}

export default CarPostModal
