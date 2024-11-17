'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)

  const switchMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  // @@ts-expect-error
  const handleClickOutside = (event: any) => {
    if (
      menuRef.current &&
      // @ts-expect-error
      !menuRef.current.contains(event.target) &&
      // @ts-expect-error
      !menuButtonRef.current.contains(event.target) // Ignore clicks on menu button
    ) {
      setIsMenuOpen(false)
    }
  }

  const handleScroll = () => {
    setIsMenuOpen(false)
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className='bg-whiteBG'>
      {/* Header with fixed position */}
      <div className='w-full fixed bg-blackopac z-10'>
        <header className='flex flex-row w-[90%] lg:w-4/6 items-center justify-between mx-auto h-10 lg:h-12'>
          {/* Mobile Logo on the Right and Desktop Logo */}
          <button
            onClick={() => {
              window.location.href = '/'
            }}
          >
            <img
              src='/logo.svg'
              alt='autocentral.tn'
              className='h-20 hover:text-white hover:filter hover:brightness-50'
            />
          </button>

          {/* Mobile Burger Menu Icon on the Left */}
          <button
            onClick={switchMenu}
            ref={menuButtonRef}
            className='lg:hidden flex flex-col lg:flex-row-reverse items-center text-titan'
          >
            <img src='/menu.svg' className='h-7 lg:h-12' alt='Menu' />
            <span className='text-xs lg:text-base lg:mr-2 -mt-1'>Menu</span>
          </button>

          {/* Desktop Menu Links */}
          <nav className='hidden lg:flex space-x-10'>
            <button
              className='flex space-x-2 items-center hover:underline'
              onClick={() => {
                router.push('/')
              }}
            >
              <img src='/flag_tn.svg' className='h-5' />
              <p className='text-sm'>Voitures d'occasion</p>
            </button>
            <button
              className='flex space-x-2 items-center hover:underline'
              onClick={() => {
                router.push('/fiche-technique')
              }}
            >
              <img src='/gears.svg' className='h-5' />
              <p className='text-sm'>Fiches techniques</p>
            </button>
            <Link
              className='flex space-x-2 items-center hover:underline'
              href='/vendeurs'
            >
              <img src='/man.svg' className='h-5' />
              <p className='text-sm'>Vendeurs professionnels</p>
            </Link>
          </nav>
        </header>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className='lg:hidden fixed bg-blackopac top-10 w-full text-titan z-50 lg:w-4/6 inset-x-0 text-center mx-auto'
        >
          <button
            className='w-full block px-4 py-2 hover:bg-whiteopac bg-whiteopac2 border-b border-whiteopac2 flex justify-end'
            onClick={() => {
              setIsMenuOpen(false)
              router.push('/')
            }}
          >
            Voitures d'occasion
            <img src='/flag_tn.svg' className='h-6 ml-2 mr-1' />
          </button>
          <button
            className='w-full block px-4 py-2 hover:bg-whiteopac border-b border-whiteopac2 flex justify-end'
            onClick={() => {
              setIsMenuOpen(false)
              router.push('/fiche-technique')
            }}
          >
            Fiches techniques
            <img src='/gears.svg' className='h-6 ml-2 mr-1' />
          </button>
          <Link
            href='/vendeurs'
            className='w-full block px-4 py-2 hover:bg-whiteopac bg-whiteopac2 border-b border-whiteopac2 flex justify-end'
            onClick={() => setIsMenuOpen(false)}
          >
            Vendeurs professionnels
            <img src='/man.svg' className='h-6 ml-2 mr-1' />
          </Link>
        </div>
      )}

      {/* Bottom Spacer to avoid content overlap */}
      <div className={`mt-10 lg:mt-12`}></div>
    </div>
  )
}
