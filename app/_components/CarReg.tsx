'use client'

import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'

const CarReg: React.FC = () => {
  const router = useRouter()

  const [leftInputTN, setLeftInputTN] = useState<string>('')
  const [rightInputTN, setRightInputTN] = useState<string>('')
  const [inputRS, setInputRS] = useState<string>('')
  const rightInputRef = useRef(null)

  const handleLeftInputTNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    if (input.length <= 3) {
      setLeftInputTN(input)
      if (input.length === 3) {
        // @ts-ignore
        rightInputRef.current.focus()
      }
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

  const handleSearchTN = () => {
    router.push(`/matricule/${rightInputTN}TU${leftInputTN}`)
  }

  const handleSearchRS = () => {
    router.push(`/matricule/${inputRS}RS`)
  }

  return (
    <div className='flex flex-col w-full lg:flex-row lg:space-x-4 items-center'>
      <p className='text-left w-full lg:w-1/3 text-xl'>
        Recherche par matricule
      </p>

      <div className='mt-2 lg:mt-0 border-2 border-red rounded-lg w-full lg:w-1/3 text-center flex flex-row items-center justify-center'>
        <input
          type='number'
          inputMode='numeric'
          value={leftInputTN}
          onChange={handleLeftInputTNChange}
          placeholder='***'
          className='bg-black placeholder-red border-none text-center text-xl outline-none text-white w-1/4'
        />
        <span className='text-xl font-bold w-1/4'>TU</span>

        <input
          type='number'
          inputMode='numeric'
          value={rightInputTN}
          onChange={handleRightInputTNChange}
          placeholder='****'
          className='bg-black placeholder-red border-none text-center text-xl outline-none text-white w-1/4'
          ref={rightInputRef}
        />

        <button
          className='w-10 mx-2 p-2 rounded bg-red hover:bg-black hover:border hover:border-white'
          onClick={handleSearchTN} // Attach the handler here
        >
          <img src='/search_white.svg' className='h-5 mx-auto' />
        </button>
      </div>

      <div className='mt-2 lg:mt-0 border-2 border-red rounded-lg w-full lg:w-1/3 text-center flex flex-row items-center justify-center'>
        <span className='text-xl font-bold w-1/3'>RS</span>
        <input
          type='number'
          inputMode='numeric'
          value={inputRS}
          onChange={handleInputRSChange}
          placeholder='******'
          className='bg-black placeholder-red border-none text-center text-xl outline-none text-white w-1/3'
        />
        <button
          className='w-10 ml-7 p-2 bg-red rounded hover:bg-black hover:border hover:border-white'
          onClick={handleSearchRS} // Attach the handler here
        >
          <img src='/search_white.svg' className='h-5 mx-auto' />
        </button>
      </div>
    </div>
  )
}

export default CarReg
