'use client'

import React from 'react'
import { CarModel } from '../../api/services/car-model.service'
import CarDimensions from './CarDimensions'

type FicheTechniqueProps = {
  carModel: CarModel
}

const FicheTechnique: React.FC<FicheTechniqueProps> = ({ carModel }) => {
  const hpGain =
    carModel.hp && carModel.hpRemap ? carModel.hpRemap - carModel.hp : null
  const torqueGain =
    carModel.torque && carModel.torqueRemap
      ? carModel.torqueRemap - carModel.torque
      : null
  const showReprog = hpGain || torqueGain

  // Determine the curve bend based on power gain
  const getBendValue = (gain: number) => {
    if (gain < 20) return 30 // Less bend
    if (gain >= 20 && gain < 35) return 25
    if (gain >= 35 && gain < 50) return 20
    return 15 // More bend for higher gains
  }

  const getColor = (gain: number) => {
    if (gain < 20) return 'yellow'
    if (gain >= 20 && gain < 35) return 'orange'
    if (gain >= 35 && gain < 50) return 'darkorange'
    return 'red'
  }

  return (
    <div>
      <div className='flex flex-row items-center justify-between space-x-8 lg:space-x-20'>
        <img src={`/car-makes/${carModel.make.id}.svg`} className='h-20 w-20' />
        <p className='text-xl lg:text-3xl flex-grow'>
          {carModel.make.name} {carModel.model}
        </p>
        <a href={`/fiche-technique/${carModel.make.id}`} className=''>
          <img
            src='/arrow_prev_red.svg'
            className='h-8 lg:h-10 border-2 border-red rounded hover:text-white hover:filter hover:brightness-0 hover:invert '
          />
        </a>
      </div>

      <div className='mt-6 text-lg'>
        <div className='flex flex-row items-center space-x-3'>
          <img src='/key.svg' className='h-5' />
          {carModel.type && <span>Type {carModel.type}</span>}
          {carModel.years !== 'all' && <span>{carModel.years}</span>}
        </div>
        {carModel.engineName && (
          <p className='flex flex-row items-center space-x-3'>
            <img src='/engine.svg' className='h-5' />
            <span>{carModel.engineName}</span>
            <span>{carModel.fuel}</span>
            <span>{carModel.cylinder}</span>
          </p>
        )}
      </div>

      {/* Engine Performance */}
      {showReprog && (
        <div className='mt-10'>
          <h2 className='text-2xl font-semibold mb-4'>
            Reprogrammation Stage 1
          </h2>

          {/* Horsepower Graphic */}
          <div className='mb-6'>
            {hpGain && (
              <p className='mb-1 font-bold'>
                Puissance{' '}
                <span className='text-red text-strong'>+{hpGain} hp</span>
              </p>
            )}
            {torqueGain && (
              <p className='mb-1 font-bold'>
                Couple{' '}
                <span className='text-red text-strong'>+{torqueGain} Nm</span>
              </p>
            )}

            <div className=''>
              {hpGain && (
                <svg viewBox='0 0 100 50' className='w-full h-16 lg:h-24'>
                  {/* Dynamic upward curve for the horsepower */}
                  <path
                    d={`M10,40 Q50,${getBendValue(hpGain)},90,20`}
                    fill='transparent'
                    stroke={getColor(hpGain)}
                    strokeWidth='4'
                  />
                  <text x='-50' y='45' fill='white'>
                    {carModel.hp} ch
                  </text>
                  <text x='150' y='25' fill='white' textAnchor='end'>
                    {carModel.hpRemap} ch
                  </text>
                </svg>
              )}
              {torqueGain && (
                <svg viewBox='0 0 100 50' className='w-full h-16 lg:h-24'>
                  {/* Dynamic upward curve for the torque */}
                  <path
                    d={`M10,40 Q50,${getBendValue(torqueGain)},90,20`}
                    fill='transparent'
                    stroke={getColor(torqueGain)}
                    strokeWidth='4'
                  />
                  <text x='-60' y='45' fill='white'>
                    {carModel.torque} Nm
                  </text>
                  <text x='160' y='25' fill='white' textAnchor='end'>
                    {carModel.torqueRemap} Nm
                  </text>
                </svg>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Related Models Section */}
      {carModel.relatedModels.length > 0 && (
        <div className='mt-10 text-sm lg:text-lg'>
          <h2 className='text-2xl font-semibold mb-2'>
            Informations techniques
          </h2>
          <ul className='lg:pl-5'>
            {carModel.relatedModels.map((relatedModel) => (
              <li key={relatedModel.id} className='mt-6'>
                <p className='font-bold flex flex-row items-center space-x-3'>
                  <img src='/car.svg' className='h-7' />
                  <span>{relatedModel.productionYears}</span>
                  <span>{relatedModel.engineDetail}</span>
                </p>
                {relatedModel.body && (
                  <p className='text-red font-bold flex flex-row items-center space-x-5'>
                    <img src='/door.svg' className='h-5' />
                    <span>{relatedModel.body}</span>
                  </p>
                )}
                {(relatedModel.engineType || relatedModel.fuelSystem) && (
                  <p className='flex flex-row items-center space-x-5'>
                    <img src='/engine.svg' className='h-5' />

                    {relatedModel.engineType && (
                      <span>{relatedModel.engineType}</span>
                    )}
                    {relatedModel.fuelSystem && (
                      <span>{relatedModel.fuelSystem}</span>
                    )}
                  </p>
                )}
                {(relatedModel.hp || relatedModel.torque) && (
                  <p className='flex flex-row items-center space-x-5 text-red'>
                    <img src='/speed2.svg' className='h-5' />
                    {relatedModel.hp && <span>{relatedModel.hp} ch</span>}
                    {relatedModel.torque && (
                      <span>{relatedModel.torque} Nm</span>
                    )}
                  </p>
                )}
                {relatedModel.acceleration && (
                  <p className='flex flex-row items-center space-x-5'>
                    <img src='/chrono.svg' className='h-5' />
                    <span>
                      Acceleration 0-100 km/h : {relatedModel.acceleration}{' '}
                      secondes
                    </span>
                  </p>
                )}
                {relatedModel.topSpeed && (
                  <p className='flex flex-row items-center space-x-5'>
                    <img src='/speed.svg' className='h-5' />
                    <span>Vitesse max : {relatedModel.topSpeed} km/h</span>
                  </p>
                )}
                {(relatedModel.gearbox || relatedModel.driveType) && (
                  <p className='flex flex-row items-center space-x-5'>
                    <img src='/gears.svg' className='h-5' />
                    <span>
                      {relatedModel.gearbox?.replace('manual', 'manuel') || ''}
                    </span>
                    <span>{relatedModel.driveType || ''}</span>
                  </p>
                )}
                {relatedModel.fuelCombined && (
                  <p className='flex flex-row items-center space-x-5'>
                    <img src='/fuel.svg' className='h-5' />
                    <span>
                      {relatedModel.fuelCombined?.toLowerCase() || ''}{' '}
                      {relatedModel.fuelHighway && relatedModel.fuelCombined
                        ? `(${relatedModel.fuelUrban?.toLocaleLowerCase()} urbain, ${relatedModel.fuelHighway.toLowerCase()} extra-urbain)`
                        : ''}
                    </span>
                  </p>
                )}
                {/* Center the CarDimensions component */}
                <div className='flex justify-center mt-4'>
                  <CarDimensions
                    length={relatedModel.length}
                    width={relatedModel.width}
                    height={relatedModel.height}
                    weight={relatedModel.weight}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default FicheTechnique
