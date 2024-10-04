'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ModelListItem } from '../../api/services/car-model.service'
import { useRouter } from 'next/navigation'

type ModelModalProps = {
  model: ModelListItem
  onClose: () => void
}

const ModelModal: React.FC<ModelModalProps> = ({ model, onClose }) => {
  const router = useRouter()
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
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
      <div
        ref={modalRef}
        className='bg-black p-8 border border-whiteopac rounded-lg w-5/6 lg:w-1/3 h-3/4 overflow-y-scroll'
      >
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-2xl'>{model.modelName}</h2>
          <button onClick={onClose} className='rounded'>
            <img
              src='/close.svg'
              className='h-6 lg:h-8 rounded hover:text-white hover:filter hover:brightness-0 hover:invert '
            />
          </button>
        </div>
        <ul>
          {model.modelYears.map((modelYear) => {
            const groupedEngines = groupEnginesByFuel(modelYear.engines)

            return (
              <li key={modelYear.year} className='mb-2'>
                <button
                  onClick={() =>
                    setSelectedYear(
                      selectedYear === modelYear.year ? null : modelYear.year
                    )
                  }
                  className='hover:underline flex w-full font-bold'
                >
                  {/* Year on the left */}
                  <span className='items-left'>{modelYear.year}</span>

                  {/* Engine type (if exists) on the far right */}
                  {modelYear.engines[0]?.type && (
                    <span className='ml-auto text-vividred'>
                      {modelYear.engines[0].type}
                    </span>
                  )}
                </button>

                {selectedYear === modelYear.year && (
                  <ul className='mt-2 ml-4'>
                    {Object.keys(groupedEngines).map((fuel) => (
                      <li key={fuel} className='text-vividred font-bold'>
                        <p className='text-white'>{fuel}</p>
                        <ul className='ml-4'>
                          {groupedEngines[fuel].map((engine: any) => (
                            <a
                              onClick={() =>
                                router.push(
                                  `/fiche-technique/reprog/${engine.id}`
                                )
                              }
                              className='hover:text-white hover:underline'
                            >
                              <li
                                key={engine.id}
                                className='mt-1 flex justify-between'
                              >
                                <span>{engine.engineName}</span>
                                <span>{engine.hp} HP</span>
                              </li>
                            </a>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default ModelModal
