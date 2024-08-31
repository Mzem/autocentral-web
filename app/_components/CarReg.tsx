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
    <div className='flex-row w-80 mx-auto'>
      {/* Option Buttons */}
      <p className='text-left'>Recherche par matricule</p>

      <div className='mt-2 border-2 border-red rounded-lg p-1 w-full text-center'>
        {/* Left Input */}
        <input
          type='number'
          value={leftInputTN}
          onChange={handleLeftInputTNChange}
          maxLength={3}
          placeholder='***'
          className='bg-black placeholder-red border-none text-center text-xl outline-none w-20 text-white'
        />
        <span className='text-xl font-bold ml-2'>TU</span>

        {/* Right Input */}
        <input
          type='number'
          value={rightInputTN}
          onChange={handleRightInputTNChange}
          maxLength={4}
          placeholder='****'
          className='bg-black placeholder-red border-none text-center text-xl outline-none w-24 text-white ml-2'
        />

        <button>
          <img src='/search.svg' className='h-5' />
        </button>
      </div>

      <div className='mt-2 border-2 border-red rounded-lg inline-block p-1 w-full text-center'>
        <span className='text-xl font-bold ml-8'>RS</span>
        <input
          type='number'
          value={inputRS}
          onChange={handleInputRSChange}
          maxLength={6}
          placeholder='******'
          className='bg-black placeholder-red border-none text-center text-xl outline-none max-w-28 text-white ml-7'
        />
        <button className='ml-7'>
          <img src='/search.svg' className='h-5' />
        </button>
      </div>
    </div>
  )
}

export default CarReg
