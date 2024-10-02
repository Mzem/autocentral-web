'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)

  const switchMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  // @ts-ignore
  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      // @ts-ignore
      !menuRef.current.contains(event.target) &&
      // @ts-ignore
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
    <>
      {/* Bottom Spacer to avoid content overlap */}
      <div className={`mt-12 lg:mt-16`}></div>

      {/* Header with fixed position */}
      <div className='w-full fixed bg-red z-10'>
        <header className='flex flex-row w-[90%] lg:w-4/6 items-center justify-between mx-auto h-12 lg:h-16'>
          {/* Mobile Logo on the Right and Desktop Logo */}
          <Link href='/'>
            <img
              src='/logo.svg'
              alt='AutoCentral.tn'
              className='h-14 hover:text-white hover:filter hover:brightness-0 hover:invert'
            />
          </Link>

          {/* Mobile Burger Menu Icon on the Left */}
          <button
            onClick={switchMenu}
            ref={menuButtonRef}
            className='lg:hidden flex flex-col lg:flex-row-reverse items-center text-cream'
          >
            <img src='/menu.svg' className='h-8 lg:h-12' alt='Menu' />
            <span className='text-xs lg:text-base lg:mr-2'>Menu</span>
          </button>

          {/* Desktop Menu Links */}
          <nav className='hidden lg:flex space-x-4'>
            <button
              className='flex space-x-2 items-center hover:underline'
              onClick={() => {
                router.push('/')
              }}
            >
              <img src='/logo_nav.svg' className='h-6' />
              <p className='text-l'>Véhicules d'occasion</p>
            </button>
            <button
              className='flex space-x-2 items-center hover:underline'
              onClick={() => {
                router.push('/vendeurs')
              }}
            >
              <img src='/man.svg' className='h-6' />
              <p className='text-l'>Vendeurs professionnels</p>
            </button>
            <button
              className='flex space-x-2 items-center hover:underline'
              onClick={() => {
                router.push('/autotech-reprog')
              }}
            >
              <img src='/gears.svg' className='h-6' />
              <p className='text-l'>Fiches techniques / Reprog</p>
            </button>
            <button
              className='cursor-not-allowed opacity-40 flex space-x-2 items-center hover:underline'
              // onClick={() => {
              //   router.push('/recherche-matricule')
              // }}
            >
              <img src='/search.svg' className='h-6' />
              <p className='text-l'>Recherche par matricule</p>
            </button>
            <button
              className='cursor-not-allowed opacity-40 flex space-x-2 items-center hover:underline'
              // onClick={() => {
              //   router.push('/blog')
              // }}
            >
              <img src='/race_flag.svg' className='h-6' />
              <p className='text-l'>Blog</p>
            </button>
          </nav>
        </header>

        {/* Bar Under Header */}
        <hr className='h-px border-0 bg-whiteopac2'></hr>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className='lg:hidden fixed bg-red border-t border-red top-12 w-full text-cream z-50 lg:w-4/6 inset-x-0 text-center mx-auto'
        >
          <button
            className='w-full block px-4 py-2 hover:bg-whiteopac bg-whiteopac2 border-b border-whiteopac2 flex justify-end'
            onClick={() => {
              setIsMenuOpen(false)
              router.push('/')
            }}
          >
            Voitures d'occasion
            <img src='/logo_nav.svg' className='h-6 ml-2 mr-1' />
          </button>
          <button
            className='w-full block px-4 py-2 hover:bg-whiteopac border-b border-whiteopac2 flex justify-end'
            onClick={() => {
              setIsMenuOpen(false)
              router.push('/vendeurs')
            }}
          >
            Vendeurs professionnels
            <img src='/man.svg' className='h-6 ml-2 mr-1' />
          </button>
          <button
            className='w-full block px-4 py-2 hover:bg-whiteopac bg-whiteopac2 border-b border-whiteopac2 flex justify-end'
            onClick={() => {
              setIsMenuOpen(false)
              router.push('/autotech-reprog')
            }}
          >
            Fiches techniques / Reprog
            <img src='/gears.svg' className='h-6 ml-2 mr-1' />
          </button>
          <button
            className='cursor-not-allowed opacity-40 w-full block px-4 py-2 hover:bg-whiteopac border-b border-whiteopac flex justify-end'
            // onClick={() => {
            //   setIsMenuOpen(false)
            //   router.push('/recherche-matricule')
            // }}
          >
            Recherche par matricule
            <img src='/search.svg' className='h-6 ml-2 mr-1' />
          </button>
          <button
            className='cursor-not-allowed opacity-40 w-full block px-4 py-2 hover:bg-whiteopac bg-whiteopac2 border-b border-cream flex justify-end'
            // onClick={() => {
            //   setIsMenuOpen(false)
            //   router.push('/blog')
            // }}
          >
            Blog
            <img src='/race_flag.svg' className='h-6 ml-2 mr-1' />
          </button>
        </div>
      )}
    </>
  )
}
