'use client'

import { useRouter } from 'next/navigation'
import { CarMake } from '../../../api/services/car-makes.service'
import { sortByStringField } from '../../utils'

type CarMakesProps = {
  carMakes: CarMake[]
}

function CarMakes({ carMakes }: CarMakesProps) {
  const router = useRouter()
  const common = sortByStringField(
    carMakes.filter((carMake) => carMake.category === 'common'),
    'name'
  )
  const performance = sortByStringField(
    carMakes.filter((carMake) => carMake.category === 'performance'),
    'name'
  )
  const other = sortByStringField(
    carMakes.filter(
      (carMake) =>
        carMake.category && ['other', 'asian'].includes(carMake.category)
    ),
    'name'
  )

  return (
    <div className='mt-12 lg:mt-16 text-black'>
      {carMakes.length > 0 && (
        <>
          <p className='text-left w-full text-xl lg:text-2xl'>
            Fiches techniques & motorisations
          </p>
          {/* <div className='flex space-x-1 items-center text-left w-full text-m lg:text-l'>
            <span>Par</span>
            <button
              onClick={() => router.push('/autotech-reprog')}
              className='font-extrabold italic underline-offset-2 hover:underline flex items-center space-x-1'
            >
              <span>Autotech-Reprogrammation</span>
              <img src='/arrow_square.svg' className='h-5' />
            </button>
          </div> */}
          {common.length > 0 && (
            <div className='mt-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4'>
              {common.map((carMake) => (
                <button
                  onClick={() => router.push(`/fiche-technique/${carMake.id}`)}
                  key={carMake.id}
                  className='flex justify-center items-center p-2 h-full'
                >
                  <img
                    src={`/car-makes/${carMake.id}.svg`}
                    alt={carMake.name}
                    className='w-20 h-20 object-contain hover:opacity-60 transition-opacity'
                  />
                </button>
              ))}
            </div>
          )}
          {performance.length > 0 && (
            <>
              <p className='mt-10 text-left w-full text-l lg:text-xl'>
                Performance
              </p>
              <div className='mt-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4'>
                {performance.map((carMake) => (
                  <button
                    onClick={() =>
                      router.push(`/fiche-technique/${carMake.id}`)
                    }
                    key={carMake.id}
                    className='flex justify-center items-center p-2 h-full'
                  >
                    <img
                      src={`/car-makes/${carMake.id}.svg`}
                      alt={carMake.name}
                      className='w-20 h-20 object-contain hover:opacity-60 transition-opacity'
                    />
                  </button>
                ))}
              </div>
            </>
          )}
          {other.length > 0 && (
            <>
              <p className='mt-10 text-left w-full text-l lg:text-xl'>Autre</p>
              <div className='mt-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4'>
                {other.map((carMake) => (
                  <button
                    onClick={() =>
                      router.push(`/fiche-technique/${carMake.id}`)
                    }
                    key={carMake.id}
                    className='flex justify-center items-center p-2 h-full'
                  >
                    <img
                      src={`/car-makes/${carMake.id}.svg`}
                      alt={carMake.name}
                      className='w-20 h-20 object-contain hover:opacity-60 transition-opacity'
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default CarMakes
