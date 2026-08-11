'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import {
  CarModelsByMake,
  ModelListItem
} from '../../../api/services/car-model.service'
import CarModelEnginesModal from './CarModelEnginesModal'

type CarModelListProps = {
  modelsByMake: CarModelsByMake
}

export default function CarModelList({ modelsByMake }: CarModelListProps) {
  const [selectedModel, setSelectedModel] = useState<ModelListItem | null>(null)

  return (
    <div className='lg:h-screen text-white'>
      <div className='flex flex-row items-center justify-between space-x-8 lg:space-x-20'>
        <img
          src={`/car-makes/${modelsByMake.make.id}.svg`}
          alt={modelsByMake.make.name}
          className='h-20 w-20 object-contain brightness-0 invert opacity-80'
        />
        <p className='text-xl lg:text-3xl flex-grow'>
          {modelsByMake.make.name}
        </p>
        <Link href='/fiche-technique' aria-label='Retour'>
          <FontAwesomeIcon
            icon={faChevronLeft}
            className='h-8 w-8 lg:h-10 lg:w-10 rounded bg-ink-950 p-2 hover:bg-ink-800'
          />
        </Link>
      </div>

      {/* The ul with wrapping horizontally */}
      <ul className='flex flex-col flex-wrap lg:max-h-[79%] mt-8 text-xl shadow rounded-lg p-3 bg-surface'>
        {modelsByMake.models.map((model: ModelListItem, index: number) => (
          <li
            key={model.modelName}
            className={`px-1 pt-1 m-[3px] rounded-lg hover:bg-white/20 ${
              index % 2 === 0 ? 'bg-surface-raised' : 'bg-surface-sunken'
            }`}
          >
            <button
              onClick={() => setSelectedModel(model)}
              className='text-white flex items-center w-full text-left'
            >
              <FontAwesomeIcon icon={faChevronRight} className='h-4 w-4 mr-2' />
              {model.modelName}
            </button>
          </li>
        ))}
      </ul>

      {selectedModel && (
        <CarModelEnginesModal
          model={selectedModel}
          onClose={() => setSelectedModel(null)}
        />
      )}
    </div>
  )
}
