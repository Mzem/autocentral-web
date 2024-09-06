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
    <div className='relative w-40 lg:w-52 text-xs text-center'>
      {/* Car SVG Image */}
      <div className='relative'>
        <img src='/car.svg' alt='Dimensions' className='max-w-2xl' />

        {lengthValue && (
          <div className='absolute top-1/3 flex justify-between items-center'>
            <div className='p-1 rounded text-white'>{lengthValue} mm</div>
            <svg className='h-8 w-full'>
              <line
                x1='10%'
                y1='50%'
                x2='90%'
                y2='50%'
                stroke='white'
                strokeWidth='1.5'
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

        {heightValue && (
          <div className='absolute right-0 top-0 h-full flex flex-col justify-between items-end overflow-hidden'>
            <svg
              className='h-full'
              viewBox='0 0 100 100'
              preserveAspectRatio='xMidYMid meet'
            >
              <line
                x1='50%'
                y1='35%'
                x2='50%'
                y2='90%'
                stroke='white'
                strokeWidth='1' // Reduced line thickness
                markerStart='url(#arrowHeight)'
                markerEnd='url(#arrowHeight)'
              />
              <defs>
                <marker
                  id='arrowHeight'
                  markerWidth='6' // Reduced marker size for better proportionality
                  markerHeight='6'
                  refX='3' // Adjusted to keep the arrow tip within bounds
                  refY='3'
                  orient='auto'
                >
                  <path d='M0,0 L6,3 L0,6 Z' fill='white' /> // Adjusted size of
                  the arrow path
                </marker>
              </defs>
            </svg>

            <div className='p-1 rounded text-white bg-black'>
              Poids {weightValue + ' kg' ?? 'inconnu'}
            </div>
          </div>
        )}

        {widthValue && (
          <div className='absolute bottom-6 w-full flex justify-between items-center'>
            <div className='bg-gray-100 p-1 rounded'>{widthValue} mm</div>
            <svg className='h-8 w-full'>
              <line
                x1='10%'
                y1='50%'
                x2='90%'
                y2='50%'
                stroke='darkred'
                strokeWidth='1.5'
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

        {heightValue && (
          <div className='absolute right-0 top-0 p-6 mr-6'>
            <p className='p-1 rounded'>{heightValue} mm</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CarDimensions
