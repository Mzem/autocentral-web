import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <>
      <div className='w-full fixed bg-black'>
        <header className='flex flex-row justify-around items-center h-16'>
          <Link href='/'>
            <img src='/logo.svg' alt='TuniAutos' className='h-14' />
          </Link>

          <Link href='/marketplace' className='flex space-x-2 items-center'>
            <img src='/flag.svg' className='h-6' />
            <p className='text-l'>Marketplace</p>
          </Link>
        </header>
        <hr className='h-px border-0 bg-red'></hr>
      </div>
      <hr className='mb-8 h-px border-0 bg-red'></hr>
    </>
  )
}
