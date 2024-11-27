'use client'

import React from 'react'
import { CarModel } from '../../../api/services/car-model.service'
import Link from 'next/link'
import { InfoCard } from '../InfoCard'

type SpecListProps = {
  engine: CarModel
  tax?: string
  isCarPost?: boolean
}

const SpecList: React.FC<SpecListProps> = ({
  engine,
  tax,
  isCarPost
}: SpecListProps) => {
  return (
    <div className='text-sm lg:text-lg font-medium p-2 lg:p-6 flex flex-col mx-auto items-left'>
      <ul className='flex flex-col space-y-1'>
        <li className='flex space-x-1 items-center'>
          <InfoCard
            img={'/car.svg'}
            value={
              engine.make.name +
              ' ' +
              engine.model +
              (engine.type ? ' ' + engine.type : '')
            }
          />
        </li>
        <li>
          {engine.fromYear && (
            <InfoCard
              img={'/calendar.svg'}
              value={engine.fromYear}
              title='Début de production'
            />
          )}
        </li>

        <li className='flex space-x-1 items-center'>
          {engine.fuel && <InfoCard value={engine.fuel} img='/fuel.svg' />}
          {engine.cylinder && <InfoCard value={engine.cylinder} />}
          {tax && <InfoCard value={tax} />}
        </li>

        <li className='flex space-x-1'>
          {engine.engineName && (
            <InfoCard value={engine.engineName} img='/engine.svg' />
          )}
          {engine.hp && <InfoCard value={engine.hp + 'ch'} img='/horse.svg' />}
          {engine.torque && (
            <InfoCard value={engine.torque + 'nm'} img='/gears_red.svg' />
          )}
        </li>
        {engine.acceleration && engine.vmax && (
          <li>
            <InfoCard
              value={`${engine.acceleration}s ${engine.vmax}km/h`}
              title='Performances'
              img='/chrono.svg'
            />
          </li>
        )}
        {engine.urban && engine.highway && (
          <li>
            <InfoCard
              //value={`${engine.urban}L/100 urbain ${engine.highway}L/100 extra`}
              value={displayConsumption(engine)!}
              title='Consommation'
              img='/fuel.svg'
            />
          </li>
        )}
      </ul>

      {engine.note && engine.pbs && (
        <div className='flex flex-col space-y-1 my-6'>
          <div className='flex items-center space-x-1 mb-1'>
            <div
              className={`w-[8px] h-[8px] lg:w-[10px] lg:h-[10px] rounded-full ${
                engine.note >= 8
                  ? 'bg-greenopac'
                  : engine.note <= 3
                  ? 'bg-vividred'
                  : engine.note <= 6
                  ? 'bg-rolexgoldopac'
                  : 'bg-titanopac'
              }`}
            />
            <span
              className={`font-semibold text-sm lg:text-lg italic ${
                engine.note >= 8
                  ? 'text-green'
                  : engine.note <= 3
                  ? 'text-vividred'
                  : engine.note <= 6
                  ? 'text-rolexgold'
                  : 'text-blackopac2'
              }`}
            >
              {engine.note >= 8
                ? 'Voiture fiable'
                : engine.note <= 3
                ? 'Fiabilité médiocre'
                : engine.note <= 6
                ? 'Fiabilité à surveiller'
                : 'Fiabilité acceptable'}
            </span>
          </div>
          <p>{engine.pbs}</p>
        </div>
      )}
      {engine.id && isCarPost && (
        <Link
          className='text-sm lg:text-base p-2 px-3 lg:px-6 flex items-center rounded-lg mx-auto hover:bg-titan text-white bg-black bg-opacity-90 transition duration-300 ease-in-out font-semibold'
          href={`/fiche-technique/motorisation/${engine.id}`}
        >
          <img
            src='/gears.svg'
            alt='Fiche technique'
            className='h-3 lg:h-4 mr-1 lg:mr-2'
          />
          <span>Fiche technique</span>
        </Link>
      )}

      {isCarPost && (
        <p className='text-sm text-blackopac2 italic mt-2 lg:mt-4'>
          Les informations sont données à titre indicatif, veuillez vous référer
          au vendeur.
        </p>
      )}
      <hr className='text-titan w-full' />
    </div>
  )
}

export default SpecList

function displayConsumption(engine: CarModel): string | null {
  if (!engine.urban || !engine.highway) return null
  const combined =
    Math.ceil((0.37 * engine.urban + 0.63 * engine.highway) * 10) / 10
  return `${combined} L/100Km combinée`
}
