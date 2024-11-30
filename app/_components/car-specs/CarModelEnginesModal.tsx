'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ModelListItem } from '../../../api/services/car-model.service'
import Link from 'next/link'

type CarModelEnginesModalProps = {
  model: ModelListItem
  onClose: () => void
}

const CarModelEnginesModal: React.FC<CarModelEnginesModalProps> = ({
  model,
  onClose
}) => {
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)

  // Close the modal if click is outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  // Function to group engines by fuel type
  const groupEnginesByFuel = (engines: any[]) => {
    return engines.reduce((acc: any, engine) => {
      if (!acc[engine.fuel]) {
        acc[engine.fuel] = []
      }
      acc[engine.fuel].push(engine)
      return acc
    }, {})
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center invert'>
      <div
        ref={modalRef}
        className='bg-black p-8 border border-whiteopac rounded-lg w-5/6 lg:w-1/3 h-3/4 overflow-y-scroll text-white'
      >
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-2xl'>{model.modelName}</h2>
          <button onClick={onClose} className='rounded'>
            <img src='/close.svg' className='h-6 lg:h-8 rounded invert' />
          </button>
        </div>
        <ul className='flex flex-col justify-between'>
          {model.modelYears.map((modelYear, index) => {
            const groupedEngines = groupEnginesByFuel(modelYear.engines)

            return (
              <li key={modelYear.year} className='mb-3'>
                <div
                  className={`rounded ${
                    selectedYear === modelYear.year
                      ? 'bg-whiteopac3'
                      : index % 2 === 0
                      ? 'bg-whiteopac2'
                      : 'bg-whiteopac3'
                  }`}
                >
                  <button
                    onClick={() =>
                      setSelectedYear(
                        selectedYear === modelYear.year ? null : modelYear.year
                      )
                    }
                    className={`hover:bg-whiteopac flex flex-row w-full space-x-2 font-bold items-center rounded`}
                  >
                    {selectedYear !== modelYear.year && (
                      <img src='/arrow_next.svg' className='h-4 mr-2' />
                    )}
                    {selectedYear === modelYear.year && (
                      <img src='/arrow_down.svg' className='h-4 mr-2' />
                    )}
                    <span className='min-w-10'>{modelYear.year}</span>
                    {modelYear.engines[0]?.type && (
                      <span className='text-titan'>
                        {modelYear.engines[0].type}
                      </span>
                    )}
                  </button>

                  {selectedYear === modelYear.year && (
                    <ul className='mt-1 ml-8'>
                      {Object.keys(groupedEngines).map((fuel) => (
                        <li key={fuel} className='text-whiteBG font-bold'>
                          <p className='text-orange'>{fuel}</p>
                          <ul className='mb-1 text-sm'>
                            {groupedEngines[fuel].map((engine: any) => (
                              <Link
                                href={`/fiche-technique/motorisation/${engine.id}`}
                                className='hover:underline cursor-pointer rounded'
                              >
                                <li
                                  key={engine.id}
                                  className='mt-1 flex justify-between w-[94%] bg-blackopac rounded'
                                >
                                  <span>{engine.engineName}</span>
                                  <span>{engine.hp} ch</span>
                                </li>
                              </Link>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default CarModelEnginesModal
