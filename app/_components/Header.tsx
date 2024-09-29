'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import React from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const closeMenu = () => {
    setIsMenuOpen(false)
  }
  const openMenu = () => {
    setIsMenuOpen(true)
  }

  // @ts-ignore
  const handleClickOutside = (event) => {
    // @ts-ignore
    if (menuRef.current && !menuRef.current.contains(event.target)) {
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
      {/* Header with fixed position */}
      <div className='w-full fixed bg-black z-10'>
        <header className='flex flex-row w-[90%] lg:w-3/5 items-center justify-between mx-auto h-16'>
          {/* Mobile Logo on the Right and Desktop Logo */}
          <Link href='/'>
            <img
              src='/logo.svg'
              alt='TuniAutos'
              className='h-14 hover:text-white hover:filter hover:brightness-0 hover:invert'
            />
          </Link>

          {/* Mobile Burger Menu Icon on the Left */}
          <div className='lg:hidden flex items-center'>
            {!isMenuOpen && (
              <button onClick={openMenu} className='text-white'>
                <img src='/menu.svg' className='h-8' alt='Menu' />
              </button>
            )}
            {isMenuOpen && (
              <button onClick={openMenu} className='text-white'>
                <img src='/menu.svg' className='h-8' alt='Menu' />
              </button>
            )}
          </div>

          {/* Desktop Menu Links */}
          <nav className='hidden lg:flex space-x-4'>
            <Link
              href='/autotech-reprog'
              className='flex space-x-2 items-center hover:underline'
            >
              <img src='/gears.svg' className='h-6' />
              <p className='text-l'>Fiches techniques & Reprogrammation</p>
            </Link>
            <Link
              href='/blog'
              className='flex space-x-2 items-center hover:underline'
            >
              <img src='/race_flag.svg' className='h-6' />
              <p className='text-l'>Blog</p>
            </Link>
          </nav>
        </header>

        {/* Red Bar Under Header */}
        <hr className='h-px border-0 bg-red'></hr>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className='lg:hidden fixed top-16 w-full bg-black text-white z-50'
        >
          <Link
            href='/autotech-reprog'
            className='block px-4 py-2 hover:bg-red bg-whiteopac2 border-b border-whiteopac2 flex justify-end'
            onClick={() => setIsMenuOpen(false)}
          >
            Fiches techniques & Reprogrammation
            <img src='/gears.svg' className='h-6 ml-2 mr-4' />
          </Link>
          <Link
            href='/blog'
            className='block px-4 py-2 hover:bg-red border-b border-whiteopac flex justify-end'
            onClick={() => setIsMenuOpen(false)}
          >
            Blog
            <img src='/race_flag.svg' className='h-6 ml-2 mr-4' />
          </Link>
        </div>
      )}

      {/* Bottom Spacer to avoid content overlap */}
      <div className={`mt-20 lg:mt-24`}></div>
    </>
  )
}
