'use client'

import React, { useState } from 'react'

const CarReg: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<'TU' | 'RS'>('TU')
  const [leftInputTN, setLeftInputTN] = useState<string>('')
  const [rightInputTN, setRightInputTN] = useState<string>('')
  const [inputRS, setInputRS] = useState<string>('')

  const handleLeftInputTNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    if (input.length <= 3) {
      setLeftInputTN(input)
    }
  }
  const handleRightInputTNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    if (input.length <= 4) {
      setRightInputTN(input)
    }
  }
  const handleInputRSChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    if (input.length <= 6) {
      setInputRS(input)
    }
  }

  return (
    <div className='flex flex-col w-80 mx-auto lg:w-3/4 lg:flex-row lg:space-x-4 items-center justify-center'>
      {/* Option Buttons */}
      <p className='text-left w-full lg:w-1/3 text-xl'>
        Recherche par matricule
      </p>

      <div className='mt-2 lg:mt-0 border-2 border-red rounded-lg p-1 w-full lg:w-1/3 text-center flex flex-row items-center justify-center'>
        {/* Left Input */}
        <input
          type='number'
          value={leftInputTN}
          onChange={handleLeftInputTNChange}
          maxLength={3}
          placeholder='***'
          className='bg-black placeholder-red border-none text-center text-xl outline-none text-white w-1/4'
        />
        <span className='text-xl font-bold  w-1/4'>TU</span>

        {/* Right Input */}
        <input
          type='number'
          value={rightInputTN}
          onChange={handleRightInputTNChange}
          maxLength={4}
          placeholder='****'
          className='bg-black placeholder-red border-none text-center text-xl outline-none text-white w-1/4'
        />

        <button className='w-10 mx-2 p-2 rounded bg-red'>
          <img src='/search_white.svg' className='h-5 mx-auto' />
        </button>
      </div>

      <div className='mt-2 lg:mt-0 border-2 border-red rounded-lg p-1 w-full lg:w-1/3 text-center flex flex-row items-center justify-center'>
        <span className='text-xl font-bold w-1/3'>RS</span>
        <input
          type='number'
          value={inputRS}
          onChange={handleInputRSChange}
          maxLength={6}
          placeholder='******'
          className='bg-black placeholder-red border-none text-center text-xl outline-none text-white w-1/3'
        />
        <button className='w-10 ml-7 p-2 bg-red rounded'>
          <img src='/search_white.svg' className='h-5 mx-auto' />
        </button>
      </div>
    </div>
  )
}

export default CarReg
