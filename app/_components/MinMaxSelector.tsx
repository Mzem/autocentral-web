import { useState } from 'react'

export default function MinMaxSelector({
  min,
  max,
  setMin,
  setMax,
  minLimit = 0,
  maxLimit = 999999,
  label
}: {
  min?: number
  max?: number
  setMin: (min: number | undefined) => void
  setMax: (max: number | undefined) => void
  minLimit?: number
  maxLimit?: number
  label: string
}) {
  const [minValue, setMinValue] = useState('')
  const [maxValue, setMaxValue] = useState('')

  const useDot = maxLimit >= 10000
  return (
    <div className='mt-1 ml-3 flex items-center max-h-6'>
      <span className='mr-2 font-medium w-[22%] lg:w-[30%] text-left max-h-6'>
        {label}
      </span>

      <div className='text-left w-full'>
        <input
          type='number'
          inputMode='numeric'
          placeholder='min.'
          value={
            useDot && min !== 0
              ? minValue ||
                min?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ||
                ''
              : min || ''
          }
          onChange={(e) => {
            const input = e.target.value.replace(/\./g, '')
            const numericInput = Number(input)
            if (!numericInput) {
              setMin(undefined)
              setMinValue('')
            }
            if (numericInput >= minLimit && numericInput <= maxLimit) {
              setMin(numericInput)
              setMinValue(input.replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
            }
          }}
          className='rounded xs:w-24 w-28 lg:w-20 xl:w-28 h-6 text-black mr-1 p-1 text-right max-h-6 mb-0 mt-0'
        />

        <input
          type='number'
          inputMode='numeric'
          placeholder='max.'
          value={
            useDot && max !== 0
              ? maxValue ||
                max?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ||
                ''
              : max || ''
          }
          onChange={(e) => {
            const input = e.target.value.replace(/\./g, '')
            const numericInput = Number(input)
            if (!numericInput) {
              setMax(undefined)
              setMaxValue('')
            }
            if (numericInput >= minLimit && numericInput <= maxLimit) {
              setMax(numericInput)
              setMaxValue(input.replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
            }
          }}
          className='rounded xs:w-24 w-28 lg:w-20 xl:w-28 h-6 text-black p-1 text-right max-h-6 mb-0 mt-0'
        />
      </div>
    </div>
  )
}
