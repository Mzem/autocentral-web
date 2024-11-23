'use client'

import React from 'react'
import { CarModel } from '../../../api/services/car-model.service'
import Link from 'next/link'

const InfoCard: React.FC<{
  img?: string
  title?: string
  value: string | number
}> = ({ img, title, value }) => {
  return (
    <div className='shadow-lg p-2 bg-white rounded-lg flex flex-col items-center w-fit'>
      <div className='flex items-center justify-between w-full'>
        {img && <img className='h-3 mr-1' src={img} />}
        {title && (
          <>
            <div className='font-semibold'>{title}</div>
            <span className='text-titan mx-[2px]'>|</span>
          </>
        )}
        <div className=''>{value}</div>
      </div>
    </div>
  )
}

type SpecListProps = {
  engine: CarModel
  tax?: string
}

const SpecList: React.FC<SpecListProps> = ({ engine, tax }: SpecListProps) => {
  return (
    <div className='text-sm lg:text-base p-2 lg:p-6'>
      <div className='lg:flex'>
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
            {engine.fromYear && (
              <InfoCard img={'/calendar.svg'} value={engine.fromYear} />
            )}
          </li>

          <li className='flex space-x-1 items-center'>
            {engine.fuel && <InfoCard value={engine.fuel} img='/fuel.svg' />}
            {tax && <InfoCard value={tax} />}
          </li>

          <li className='flex space-x-1'>
            {engine.engineName && (
              <InfoCard value={engine.engineName} img='/engine.svg' />
            )}
            {engine.hp && (
              <InfoCard value={engine.hp + 'ch'} img='/horse.svg' />
            )}
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
        <div className='lg:max-w-[40%] mx-auto'>
          {engine.note && engine.pbs && (
            <div className='flex flex-col items-center space-x-1'>
              <div className='flex items-center space-x-1  my-4 lg:mb-6'>
                <div
                  className={`w-[8px] h-[8px] lg:w-[10px] lg:h-[10px] rounded-full ${
                    engine.note >= 8
                      ? 'bg-greenopac'
                      : engine.note <= 5
                      ? 'bg-rolexgoldopac'
                      : 'bg-titanopac'
                  }`}
                />
                <span
                  className={`font-normal text-sm lg:text-lg italic ${
                    engine.note >= 8
                      ? 'text-green'
                      : engine.note <= 3
                      ? 'text-red'
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
          {engine.id && (
            <div className='underline mb-2 cursor-pointer'>
              <Link href={`/fiche-technique/motorisation/${engine.id}`}>
                Voir la fiche technique détaillée
              </Link>
            </div>
          )}
        </div>
      </div>
      <p className='text-xs text-blackopac2 italic'>
        Les informations sont données à titre indicatif, veuillez vous référer
        au vendeur.
      </p>
      <hr className='text-titan' />
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
