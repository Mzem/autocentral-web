'use client'

import Link from 'next/link'
import { useState } from 'react'
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
    <div className='lg:h-screen text-black'>
      <div className='flex flex-row items-center justify-between space-x-8 lg:space-x-20'>
        <img
          src={`/car-makes/${modelsByMake.make.id}.svg`}
          className='h-20 w-20'
        />
        <p className='text-xl lg:text-3xl flex-grow'>
          {modelsByMake.make.name}
        </p>
        <Link href='/fiche-technique'>
          <img
            src='/arrow_prev.svg'
            className='h-8 lg:h-10 bg-blackopac rounded hover:bg-titan'
          />
        </Link>
      </div>

      {/* The ul with wrapping horizontally */}
      <ul className='flex flex-col flex-wrap lg:max-h-[79%] mt-8 text-xl shadow rounded-lg p-3 bg-white'>
        {modelsByMake.models.map((model: ModelListItem, index: number) => (
          <li
            key={model.modelName}
            className={`px-1 pt-1 m-[3px] rounded-lg hover:bg-titanopac ${
              index % 2 === 0 ? 'bg-whiteBGDarker' : 'bg-whiteBG'
            }`}
          >
            <button
              onClick={() => setSelectedModel(model)}
              className='text-pureblack flex items-center w-full text-left'
            >
              <img src='/arrow_next.svg' className='h-4 mr-2 invert' />
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
