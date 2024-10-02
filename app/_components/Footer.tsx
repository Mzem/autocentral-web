import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <div className='bg-black'>
      <hr className='h-px border-0 bg-whiteopac3'></hr>
      <footer className='flex flex-col justify-around items-center mt-2'>
        <p className='text-l text-vividred'>Site en construction...</p>
        <p className='text-l text-white'>AutoCentral.tn 2024</p>
        <div className='flex flex-row space-x-2 mb-4'>
          <a
            href='https://www.instagram.com/tuniautos'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src='/instagram.svg'
              alt='Instagram'
              className='h-5 w-5 hover:text-white hover:filter hover:brightness-0 hover:invert '
            />
          </a>
          <a
            href='https://www.facebook.com/tuniautos'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src='/facebook.svg'
              alt='Facebook'
              className='h-5 w-5 hover:text-white hover:filter hover:brightness-0 hover:invert '
            />
          </a>
        </div>
      </footer>
    </div>
  )
}
