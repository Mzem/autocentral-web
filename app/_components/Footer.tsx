import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <div className='bg-blackopac'>
      <footer className='flex flex-col justify-around items-center mt-2'>
        <p className='text-l text-titan'>Site en construction...</p>
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
              className='h-5 w-5 hover:text-white hover:filter hover:brightness-50 '
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
              className='h-5 w-5 hover:text-white hover:filter hover:brightness-50 '
            />
          </a>
        </div>
      </footer>
    </div>
  )
}
