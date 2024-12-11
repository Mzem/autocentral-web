'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function Header() {
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
      <div
        className={`w-full fixed z-10 ${
          isMenuOpen ? 'bg-blacknotopac' : 'bg-blackopac'
        }`}
      >
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

          <a
            href={`https://m.me/autocentral.tn?text=Je%20veux%20d%C3%A9poser%20une%20annonce%20sur%20autocentral`}
            className='xl:hidden rounded-lg bg-whiteopac2 flex items-center space-x-1 text-sm lg:text-base py-[2px] px-[4px] md:ml-80 lg:ml-48'
          >
            <p className=''>Contact</p>
            <img
              src='/whatsapp_white.svg'
              className='h-[1rem] xs:h-[0.7rem] w-[1rem] xs:w-[0.7rem]'
              alt='Whatsapp'
            />
          </a>

          {/* Mobile Burger Menu Icon on the Left */}
          <button
            onClick={switchMenu}
            ref={menuButtonRef}
            className='xl:hidden flex flex-col lg:flex-row-reverse items-center text-titan'
          >
            <img
              src='/menu.svg'
              className='h-7 lg:h-12 w-7 lg:w-12'
              alt='Ouvrir le menu'
            />
            <span className='text-xs lg:text-base lg:mr-2 -mt-1'>Menu</span>
          </button>

          {/* Desktop Menu Links */}
          <nav className='hidden xl:flex space-x-5'>
            <a
              href={`https://m.me/autocentral.tn?text=Je%20veux%20d%C3%A9poser%20une%20annonce%20sur%20autocentral`}
              className='rounded-lg bg-whiteopac2 flex text-sm items-center space-x-1 py-[2px] px-[6px]'
            >
              <p>Contactez-nous</p>
              <img
                src='/whatsapp_white.svg'
                className='h-[1rem]'
                alt='Whatsapp'
              />
            </a>
            <Link
              className='flex space-x-2 items-center hover:underline'
              href='/'
            >
              <img src='/car_white.svg' className='h-5' />
              <p className='text-sm'>Voitures d'occasion</p>
            </Link>
            <Link
              className='flex space-x-2 items-center hover:underline'
              href='/fiche-technique'
            >
              <img src='/gears.svg' className='h-5' />
              <p className='text-sm'>Fiches techniques</p>
            </Link>
            <Link
              className='flex space-x-2 items-center hover:underline'
              href='/vendeurs'
            >
              <img src='/man.svg' className='h-5' />
              <p className='text-sm'>Vendeurs professionnels</p>
            </Link>
            <Link
              className='flex space-x-2 items-center hover:underline'
              href='/produits'
            >
              <img src='/cart.svg' className='h-5' />
              <p className='text-sm'>Boutique</p>
            </Link>
          </nav>
        </header>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className='xl:hidden fixed bg-blackopac top-10 w-full text-titan z-50 lg:w-4/6 inset-x-0 text-center mx-auto'
        >
          <Link
            className='w-full block px-4 py-2 hover:bg-whiteopac bg-blacklight border-b border-whiteopac2 flex justify-end'
            onClick={() => {
              setIsMenuOpen(false)
            }}
            href='/'
          >
            Voitures d'occasion
            <img src='/car_white.svg' className='h-6 ml-2 mr-1' />
          </Link>
          <Link
            className='w-full block px-4 py-2 hover:bg-whiteopac  bg-blacknotopac border-b border-whiteopac flex justify-end'
            onClick={() => {
              setIsMenuOpen(false)
            }}
            href='/fiche-technique'
          >
            Fiches techniques
            <img src='/gears.svg' className='h-6 ml-2 mr-1' />
          </Link>
          <Link
            href='/vendeurs'
            className='w-full block px-4 py-2 hover:bg-whiteopac bg-blacklight border-b border-whiteopac2 flex justify-end'
            onClick={() => setIsMenuOpen(false)}
          >
            Vendeurs professionnels
            <img src='/man.svg' className='h-6 ml-2 mr-1' />
          </Link>
          <Link
            href='/produits'
            className='w-full block px-4 py-2 hover:bg-whiteopac bg-blacknotopac border-b-2 border-titanopac flex justify-end'
            onClick={() => setIsMenuOpen(false)}
          >
            Boutique & produits dérivés
            <img src='/cart.svg' className='h-6 ml-2 mr-1' />
          </Link>
        </div>
      )}

      {/* Bottom Spacer to avoid content overlap */}
      <div className={`mt-10 lg:mt-12`}></div>
    </div>
  )
}
