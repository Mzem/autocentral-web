'use client'

import React from 'react'
import { CarModel, RelatedCarModel } from '../../api/services/car-model.service'
import CarDimensions from './CarDimensions'
import ShopHeader from './ShopHeader'
import { sortByStringField } from '../utils'
import { useRouter } from 'next/navigation'

type FicheTechniqueProps = {
  carModel: CarModel
}

const FicheTechnique: React.FC<FicheTechniqueProps> = ({ carModel }) => {
  const router = useRouter()
  const hpGain =
    carModel.hp && carModel.hpStage1 ? carModel.hpStage1 - carModel.hp : null
  const torqueGain =
    carModel.torque && carModel.torqueStage1
      ? carModel.torqueStage1 - carModel.torque
      : null
  const showReprog = hpGain && torqueGain

  return (
    <div className='text-black'>
      <div className='flex flex-row items-center justify-between space-x-8 lg:space-x-20'>
        <button
          onClick={() => router.push(`/fiche-technique/${carModel.make.id}`)}
        >
          <img
            src={`/car-makes/${carModel.make.id}.svg`}
            className='h-20 w-20'
          />
        </button>
        <p className='text-xl lg:text-3xl flex-grow font-bold'>
          {carModel.make.name} {carModel.model}
        </p>
        <button
          onClick={() => router.push(`/fiche-technique/${carModel.make.id}`)}
        >
          <img
            src='/arrow_prev.svg'
            className='h-8 lg:h-10 border bg-blackopac rounded hover:bg-titan'
          />
        </button>
      </div>

      <div className='mt-6 text-lg font-bold'>
        <div className='flex flex-row items-center space-x-4'>
          <img src='/key.svg' className='h-5' />
          {carModel.type && <span>Type {carModel.type}</span>}
          {carModel.fromYear && <span>{carModel.fromYear}</span>}
        </div>
        {carModel.engineName && (
          <p className='flex flex-row items-center space-x-4'>
            <img src='/engine.svg' className='h-5' />
            <span>{carModel.engineName}</span>
            <span>{carModel.fuel}</span>
            <span className='text-vividred'>
              {carModel.cylinder}
              {carModel.hp ? ` ${carModel.hp} ch` : ''}
            </span>
          </p>
        )}
      </div>

      <div className='mt-10'>
        <h2 className='text-2xl font-semibold mb-4'>Reprogrammation Stage 1</h2>

        {!showReprog && (
          <p>
            Le programme est en cours de développement, veuillez nous contacter
            pour plus d'informations..
          </p>
        )}

        {showReprog && (
          <table className='text-sm lg:text-l font-bold mt-6 text-center lg:w-3/4 mx-auto border-collapse overflow-hidden shadow-lg rounded-lg'>
            <thead>
              <tr className='bg-blackopac text-white text-base lg:text-lg'>
                <th className='p-3 lg:p-4'></th>
                <th className='border-b-4 p-3 lg:p-4'>Origine</th>
                <th className='border-b-4 p-3 lg:p-4 text-vividred'>Stage 1</th>
                <th className='border-b-4 p-3 lg:p-4 text-gold'>Gain</th>
              </tr>
            </thead>
            <tbody className='lg:text-lg'>
              <tr className='bg-whiteopac hover:bg-blackopac2 transition-colors duration-200'>
                <td className='border-b-2 p-3 lg:p-4'>Puissance</td>
                <td className='border-b-2 p-3 lg:p-4'>{carModel.hp} ch</td>
                <td className='border-b-2 p-3 lg:p-4 text-vividred'>
                  {carModel.hpStage1} ch
                </td>
                <td className='border-b-2 p-3 lg:p-4 text-gold'>
                  + {hpGain} ch
                </td>
              </tr>
              <tr className='bg-whiteBGDarker hover:bg-blackopac2 transition-colors duration-200'>
                <td className='border-b-2 p-3 lg:p-4'>Couple</td>
                <td className='border-b-2 p-3 lg:p-4'>{carModel.torque} Nm</td>
                <td className='border-b-2 p-3 lg:p-4 text-vividred'>
                  {carModel.torqueStage1} Nm
                </td>
                <td className='border-b-2 p-3 lg:p-4 text-gold'>
                  + {torqueGain} Nm
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      <div className='mt-10'>
        <ShopHeader
          id='autotech'
          name='Autotech Reprogrammation Moteur'
          phone='50 720 660'
          phoneText='RDV'
          location='https://www.google.com/maps/place/AutoTech+Reprogrammation+Moteur/@36.8799982,10.2991194,15z/data=!4m2!3m1!1s0x0:0x8e7d0ae9fd9aad0d?sa=X&ved=1t:2428&ictx=111'
          fb='https://www.facebook.com/autotechreprogrammation'
          insta='https://www.instagram.com/autotech_reprog'
          small={true}
        />
      </div>

      {/* Related Models Section */}
      {carModel.relatedModels.length > 0 && (
        <div className='mt-12 lg:mt-16 text-sm lg:text-lg'>
          <h2 className='text-2xl font-semibold mb-2'>
            Modèles avec même motorisation
          </h2>
          <ul className='lg:pl-5'>
            {sortByStringField(carModel.relatedModels, 'productionYears').map(
              (relatedModel) => (
                <li
                  key={relatedModel.id}
                  className='mt-4 lg:flex lg:justify-between lg:items-center'
                >
                  <div>
                    <p className='font-bold flex flex-row items-center space-x-3'>
                      <img src='/car.svg' className='h-7' />
                      <span>
                        {startYear(relatedModel.productionYears)}
                        {relatedModel.model
                          ? ' ' + relatedModel.model.replace('doors', 'portes')
                          : ''}
                        {relatedModel.engineDetail
                          ? ' ' + renameEngine(relatedModel.engineDetail)
                          : ''}
                      </span>
                    </p>
                    {relatedModel.body && (
                      <p className='font-bold flex flex-row items-center space-x-4'>
                        <img src='/door.svg' className='mb-1 ml-1 h-5' />
                        <span>{renamebody(relatedModel.body)}</span>
                      </p>
                    )}
                    {displayEngine(relatedModel) && (
                      <p className='flex flex-row items-center space-x-4'>
                        <img src='/engine.svg' className='mb-1 ml-1 h-5' />
                        <span>{displayEngine(relatedModel)}</span>
                      </p>
                    )}
                    {displaySpeed(relatedModel) && (
                      <p className='flex flex-row items-center space-x-4 text-vividred font-bold'>
                        <img src='/chrono.svg' className='mb-1 ml-1 h-5' />
                        <span>{displaySpeed(relatedModel)}</span>
                      </p>
                    )}
                    {displayGearbox(relatedModel) && (
                      <p className='flex flex-row items-center space-x-4'>
                        <img
                          src='/gears.svg'
                          className='mb-1 ml-1 h-5 invert'
                        />
                        <span>{displayGearbox(relatedModel)}</span>
                      </p>
                    )}
                    {displayDrive(relatedModel) && (
                      <p className='flex flex-row items-center space-x-4'>
                        <img src='/wheel.svg' className='mb-1 ml-1 h-5' />
                        <span>{displayDrive(relatedModel)}</span>
                      </p>
                    )}
                    {relatedModel.fuelCombined && (
                      <p className='flex flex-row items-center space-x-4'>
                        <img src='/fuel.svg' className='mb-1 ml-1 h-5' />
                        <span>
                          {relatedModel.fuelCombined?.toLowerCase() || ''}{' '}
                          {relatedModel.fuelHighway && relatedModel.fuelCombined
                            ? `(${relatedModel.fuelUrban
                                ?.toLocaleLowerCase()
                                .replace(
                                  'l/100km',
                                  'urbain'
                                )}, ${relatedModel.fuelHighway
                                .toLowerCase()
                                .replace('l/100km', 'extra')})`
                            : ''}
                        </span>
                      </p>
                    )}
                  </div>
                  {/* Center the CarDimensions component */}
                  <div className='flex justify-center lg:mr-24'>
                    <CarDimensions
                      length={relatedModel.length}
                      width={relatedModel.width}
                      height={relatedModel.height}
                      weight={relatedModel.weight}
                    />
                  </div>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default FicheTechnique

function startYear(years?: string): string | undefined {
  return years?.split(' ')[0]
}

function renameEngine(engine?: string): string | undefined {
  if (engine) {
    const newLength = engine.split(' ').length - (engine.includes('WD') ? 4 : 3)
    return engine.split(' ').splice(0, newLength).join(' ')
  }
}

function renamebody(body?: string): string | undefined {
  if (body) {
    return body
      .replace(' (Spyder, Cabriolet)', '')
      .replace(' (break, combi, touring)', '/Break')
  }
}

function displayEngine(model: RelatedCarModel): string | undefined {
  function renameEngine(engineType: string): string {
    const isInline = engineType.charAt(0) === 'L' ? true : false
    if (isInline) {
      return `${engineType.charAt(1)} cylindres`
    }
    return engineType
  }

  let res = undefined

  if (model.engineType) {
    res = renameEngine(model.engineType)
    if (model.cylinder) res += ` ${model.cylinder}`
    if (model.hp) res += ` ${model.hp}ch`
    if (model.torque) res += ` ${model.torque}Nm`
  } else if (model.cylinder) {
    res = model.cylinder
    if (model.hp) res += ` ${model.hp}ch`
    if (model.torque) res += ` ${model.torque}Nm`
  } else if (model.hp) {
    res = `${model.hp}ch`
    if (model.torque) res += ` ${model.torque}Nm`
  } else if (model.torque) {
    res = `${model.torque}Nm`
  }

  return res
}

function displaySpeed(model: RelatedCarModel): string | undefined {
  let res = undefined

  if (model.acceleration) {
    res = `0-100km/h ${model.acceleration}s`
    if (model.topSpeed) {
      res += ` - ${model.topSpeed}km/h`
    }
  } else if (model.topSpeed) {
    res = `Vitesse Max ${model.topSpeed}km/h`
  }

  return res
}

function displayGearbox(model: RelatedCarModel): string | undefined {
  function renameGearbox(gearbox: string): string {
    let res = gearbox
    if (gearbox && gearbox.includes('-speed')) {
      res = gearbox.replace('-speed', '')
      res = `Boite ${res}`
    } else if (gearbox && gearbox.includes('speed')) {
      res = gearbox.replace('speed', '')
      res = `Boite ${res}`
    }
    return res
      ?.replace('-automatic', ' automatique')
      .replace('automatic', 'automatique')
      .replace('-manual', ' manuelle')
      .replace('manual', 'manuelle')
      .replace('six', '6')
      .replace('Six', '6')
  }

  let res = undefined
  if (model.gearbox) {
    res = renameGearbox(model.gearbox)
  }
  return res
}

function displayDrive(model: RelatedCarModel): string | undefined {
  function renameDrive(drive: string): string {
    return drive
      .replace('RWD', 'Propulsion')
      .replace('FWD', 'Traction')
      .replace('AWD', 'Intégrale')
  }
  let res = undefined
  if (model.driveType) {
    res = renameDrive(model.driveType)
  }
  return res
}
