'use client'

import React from 'react'
import { CarModel } from '../../../api/services/car-model.service'
import Link from 'next/link'

type SpecListProps = {
  engine: CarModel
  tax?: string
}

const SpecList: React.FC<SpecListProps> = ({ engine, tax }: SpecListProps) => {
  return (
    <ul className='text-sm lg:text-base p-2 lg:p-6'>
      <li>
        <strong>Modèle :</strong> {engine.make.name} {engine.model}{' '}
        {engine.type}
      </li>
      <li>
        <strong>Début de production :</strong> {engine.fromYear}
      </li>
      {tax && <li>{tax}</li>}
      <li>
        <strong>Moteur :</strong> {engine.engineName} {engine.fuel}
        {engine.hp ? ' ' + engine.hp + ' Ch' : ''}
        {engine.torque ? ' ' + engine.torque + ' Nm' : ''}
      </li>
      {engine.acceleration && (
        <li>
          <strong>Acceleration :</strong> {engine.acceleration}s
        </li>
      )}
      {engine.vmax && (
        <li>
          <strong>Vitesse max :</strong> {engine.vmax} km/h
        </li>
      )}
      {engine.urban && engine.highway && (
        <li>
          <strong>Consommation :</strong> {displayConsumption(engine)}
        </li>
      )}
      {engine.note && engine.pbs && (
        <li className='flex items-center space-x-1'>
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
                : engine.note <= 5
                ? 'text-rolexgold'
                : 'text-blackopac2'
            }`}
          >
            {engine.note >= 8
              ? 'Voiture fiable'
              : engine.note <= 5
              ? 'Fiabilité à surveiller'
              : 'Fiabilité acceptable'}
          </span>
        </li>
      )}
      {engine.pbs && <li>{engine.pbs}</li>}
      {engine.id && (
        <li className='underline mb-2 cursor-pointer'>
          <Link href={`/fiche-technique/motorisation/${engine.id}`}>
            Voir la fiche technique détaillée
          </Link>
        </li>
      )}
      <p className='text-xs text-blackopac2 italic'>
        Les informations sont données à titre indicatif, veuillez vous référer
        au vendeur.
      </p>
      <li>
        <hr className='text-titan' />
      </li>
    </ul>
  )
}

export default SpecList

function displayConsumption(engine: CarModel): string | null {
  if (!engine.urban || !engine.highway) return null
  const combined =
    Math.ceil((0.37 * engine.urban + 0.63 * engine.highway) * 10) / 10
  return `${combined} L/100Km combinée`
}
