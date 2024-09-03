import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <>
      <div className='w-full fixed bg-black z-10'>
        <header className='flex flex-row w-5/6 lg:w-3/5 items-center justify-between mx-auto h-16'>
          <Link href='/'>
            <img
              src='/logo.svg'
              alt='TuniAutos'
              className='h-14 hover:text-white hover:filter hover:brightness-0 hover:invert'
            />
          </Link>

          <Link
            href='/marketplace'
            className='flex space-x-2 items-center hover:underline'
          >
            <img src='/flag.svg' className='h-6' />
            <p className='text-l'>Marketplace</p>
          </Link>
        </header>
        <hr className='h-px border-0 bg-red'></hr>
      </div>
      <hr className='h-px border-0 bg-red mb-24 lg:mb-28'></hr>
    </>
  )
}
