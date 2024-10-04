'use client'

import { useState } from 'react'
import {
  CarModelsByMake,
  ModelListItem
} from '../../api/services/car-model.service'
import ModelModal from './ModelModal'
import { useRouter } from 'next/navigation'

type ModelListClientProps = {
  modelsByMake: CarModelsByMake
}

export default function ModelListClient({
  modelsByMake
}: ModelListClientProps) {
  const router = useRouter()
  const [selectedModel, setSelectedModel] = useState<ModelListItem | null>(null)

  return (
    <div className='lg:h-screen'>
      <div className='flex flex-row items-center justify-between space-x-8 lg:space-x-20 '>
        <img
          src={`/car-makes/${modelsByMake.make.id}.svg`}
          className='h-20 w-20'
        />
        <p className='text-xl lg:text-3xl flex-grow'>
          {modelsByMake.make.name}
        </p>
        <button onClick={() => router.push(`/autotech-reprog`)}>
          <img
            src='/arrow_prev_red.svg'
            className='h-8 lg:h-10 border-2 border-cream rounded hover:text-white hover:filter hover:brightness-0 hover:invert '
          />
        </button>
      </div>

      {/* The ul with wrapping horizontally */}
      <ul className='flex flex-col flex-wrap lg:max-h-[720px] mt-8 text-xl border-2 border-whiteopac rounded-lg p-3'>
        {modelsByMake.models.map((model: ModelListItem, index: number) => (
          <li
            key={model.modelName}
            className={`px-1 pt-1 ${
              index % 2 === 0 ? 'bg-whiteopac3' : 'bg-whiteopac2'
            }`}
          >
            <button
              onClick={() => setSelectedModel(model)}
              className='text-white flex items-center hover:bg-whiteopac hover:rounded hover:text-cream w-full text-left'
            >
              <img src='/arrow_next_red.svg' className='h-4 mr-2' />
              {model.modelName}
            </button>
            <hr className='mt-1 border-t border-dashed border-whiteopac' />
          </li>
        ))}
      </ul>

      {selectedModel && (
        <ModelModal
          model={selectedModel}
          onClose={() => setSelectedModel(null)}
        />
      )}
    </div>
  )
}
