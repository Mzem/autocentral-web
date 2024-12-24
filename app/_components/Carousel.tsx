import { useEffect, useRef, useState } from 'react'

export const Carousel: React.FC<{
  images: string[]
  setIsFullImage: any
  noCaption?: boolean
}> = ({ images, setIsFullImage, noCaption }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fullScreenImage, setFullScreenImage] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // State for image loading
  const overlayRef = useRef<HTMLDivElement>(null)
  const prevButtonRef = useRef<HTMLButtonElement>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)

  const nextImage = () => {
    setIsLoading(true) // Set loading state when switching images
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }
  const prevImage = () => {
    setIsLoading(true) // Set loading state when switching images
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    )
  }

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        if (images.length === 1) {
          setFullScreenImage(false)
          setIsFullImage(false)
        } else if (
          // @ts-expect-error
          !prevButtonRef.current.contains(event.target) &&
          // @ts-expect-error
          !nextButtonRef.current.contains(event.target)
        ) {
          setFullScreenImage(false)
          setIsFullImage(false)
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
      onClick={() => {
        setFullScreenImage(true)
        setIsFullImage(true)
      }}
    >
      <div className='relative mx-auto h-64 w-full rounded-lg'>
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center rounded-lg'>
            <span className='loader'></span>{' '}
            {/* Add your loader/spinner here */}
          </div>
        )}
        <img
          src={images[currentIndex]}
          alt='Car image'
          className={`mx-auto h-64 object-contain cursor-pointer rounded-lg ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)} // Image has loaded
          onError={() => setIsLoading(false)} // Handle loading error
        />
      </div>
      {!noCaption && (
        <span className='text-[0.7rem] italic text-blackopac2 mx-auto w-full flex justify-around mt-[2px]'>
          Cliquer sur l'image pour l'agrandir
        </span>
      )}
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
          className='fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50'
          onClick={() => {
            setFullScreenImage(false)
            setIsFullImage(false)
          }}
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
                setIsFullImage(false)
              }}
              className='absolute top-1 right-1 p-3 bg-black bg-opacity-20 hover:bg-opacity-50 rounded-full z-50'
            >
              <img src='/close.svg' alt='Fermer' className='h-8 w-8 invert' />
            </button>
            <div className='relative'>
              {isLoading && (
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='loader'></span>
                </div>
              )}
              <img
                src={images[currentIndex]}
                alt='Car image'
                className={`object-contain max-h-[100dvh] max-w-full ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onClick={() => {
                  if (images.length > 1) nextImage()
                }}
                onLoad={() => setIsLoading(false)} // Image has loaded
                onError={() => setIsLoading(false)} // Handle loading error
              />
            </div>
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
