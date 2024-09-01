'use client'

import Link from 'next/link'
import { CarMake } from '../../api/services/car-makes.service'

type CarMakesProps = {
  carMakes: CarMake[]
}

function CarMakes({ carMakes }: CarMakesProps) {
  return (
    <>
      {carMakes.length > 0 && (
        <div className='mt-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4'>
          {carMakes.map((carMake) => (
            <Link
              href={`/fiche-technique/${carMake.id}`}
              key={carMake.id}
              className='block p-2'
            >
              <img
                src={`car-makes/${carMake.id}.svg`}
                alt={carMake.name}
                className='w-20 h-20 object-contain hover:opacity-80 transition-opacity'
              />
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

export default CarMakes
