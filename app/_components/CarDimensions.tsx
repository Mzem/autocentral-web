'use client'

import React from 'react'

type CarDimensionsProps = {
  length?: string
  width?: string
  height?: string
  weight?: string
}

// Helper function to convert string to number, returning null if conversion fails
const convertToNumber = (value?: string): number | null => {
  const num = parseFloat(value ?? '')
  return isNaN(num) ? null : num
}

const CarDimensions: React.FC<CarDimensionsProps> = ({
  length,
  width,
  height,
  weight
}) => {
  const lengthValue = convertToNumber(length)
  const widthValue = convertToNumber(width)
  const heightValue = convertToNumber(height)
  const weightValue = convertToNumber(weight)

  // If no valid props are provided, show nothing
  if (!lengthValue && !widthValue && !heightValue && !weightValue) {
    return null
  }

  return (
    <div className='relative w-44 lg:w-52 h-auto'>
      {/* Car SVG Image */}
      <div className='relative'>
        <img
          src='/car.svg'
          alt='Dimensions'
          className='w-full h-auto max-w-2xl mx-auto'
        />

        {/* Length Arrow and Label */}
        {lengthValue && (
          <div className='absolute top-1/3 w-full flex justify-between items-center'>
            <div className='text-center text-xs bg-gray-100 p-1 rounded text-white'>
              {lengthValue} mm
            </div>
            <svg className='h-8 w-full'>
              <line
                x1='10%'
                y1='50%'
                x2='90%'
                y2='50%'
                stroke='white'
                strokeWidth='2'
                markerStart='url(#arrow)'
                markerEnd='url(#arrow)'
              />
              <defs>
                <marker
                  id='arrow'
                  markerWidth='10'
                  markerHeight='10'
                  refX='5'
                  refY='5'
                  orient='auto'
                >
                  <path d='M0,0 L10,5 L0,10 Z' fill='white' />
                </marker>
              </defs>
            </svg>
          </div>
        )}

        {/* Height Arrow and Label */}
        {heightValue && (
          <div className='absolute left-0 top-0 h-full flex flex-col justify-between items-start'>
            <svg className='h-full'>
              <line
                x1='50%'
                y1='35%'
                x2='50%'
                y2='90%'
                stroke='white'
                strokeWidth='2'
                markerStart='url(#arrowHeight)'
                markerEnd='url(#arrowHeight)'
              />
              <defs>
                <marker
                  id='arrowHeight'
                  markerWidth='10'
                  markerHeight='10'
                  refX='5'
                  refY='5'
                  orient='auto'
                >
                  <path d='M0,0 L10,5 L0,10 Z' fill='white' />
                </marker>
              </defs>
            </svg>
            {weightValue && (
              <div className='text-center text-xs p-1 rounded text-strong'>
                Poids {weightValue} kg
              </div>
            )}
          </div>
        )}

        {/* Width Arrow and Label */}
        {widthValue && (
          <div className='absolute bottom-6 w-full flex justify-between items-center'>
            <div className='text-center text-xs bg-gray-100 p-1 rounded'>
              {widthValue} mm
            </div>
            <svg className='h-8 w-full'>
              <line
                x1='10%'
                y1='50%'
                x2='90%'
                y2='50%'
                stroke='darkred'
                strokeWidth='2'
                markerStart='url(#arrowWidth)'
                markerEnd='url(#arrowWidth)'
              />
              <defs>
                <marker
                  id='arrowWidth'
                  markerWidth='10'
                  markerHeight='10'
                  refX='5'
                  refY='5'
                  orient='auto'
                >
                  <path d='M0,0 L10,5 L0,10 Z' fill='darkred' />
                </marker>
              </defs>
            </svg>
          </div>
        )}

        {/* Weight Label */}
        {heightValue && (
          <div className='absolute right-0 top-0 p-6'>
            <p className='text-xs p-1 rounded'>{heightValue} mm</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CarDimensions
