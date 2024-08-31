import React, { useState } from 'react'
import ProgressiveImage from './ProgressiveImage'

function ImageWithModal({ src, alt }: { src: string; alt: string }) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)
  const handleOutsideClick = (e: any) => {
    if (e.target.classList.contains('modal-overlay')) {
      closeModal()
    }
  }

  return (
    <>
      <ProgressiveImage
        src={src}
        alt={alt}
        placeholder='cake.svg'
        onClick={openModal}
        className='h-4/6 w-full object-cover rounded-md cursor-pointer'
      />
      {isOpen && (
        <div
          className='fixed top-0 left-0 w-full h-full flex justify-center items-center modal-overlay'
          onClick={handleOutsideClick}
        >
          <div className='p-4'>
            <img src={src} alt={alt} className='max-h-[720px] rounded-md' />
            <button
              onClick={closeModal}
              className='bg-red text-white font-bold py-2 px-4 rounded-full top-0 right-0 m-4'
            >
              Retour
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ImageWithModal
