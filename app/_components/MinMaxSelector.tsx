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
    <div className='mt-1 ml-3 flex items-center'>
      <span
        className={`text-xs lg:text-base text-whiteBG ${
          label.length < 4 ? 'mr-[7px]' : 'mr-1'
        }`}
      >
        {label} min.
      </span>
      <input
        type='number'
        inputMode='numeric'
        value={
          useDot
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
        className={`rounded w-${
          maxLimit < 10000 ? (maxLimit < 1000 ? '10' : '16') : '20'
        } h-6 text-black mr-1 p-1 text-right`}
      />
      <span
        className={`text-xs lg:text-base text-whiteBG ${
          label.length < 4 ? 'mr-[8px]' : 'mr-1'
        }`}
      >
        {label} max.
      </span>
      <input
        type='number'
        inputMode='numeric'
        value={
          useDot
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
        className={`rounded w-${
          maxLimit < 10000 ? (maxLimit < 1000 ? '10' : '16') : '20'
        } h-6 text-black p-1 text-right`}
      />
    </div>
  )
}
