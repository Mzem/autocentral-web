'use client'

import Link from 'next/link'
import React from 'react'
import { CarModel } from '../../../api/services/car-model.service'
import ShopHeader from '../ShopHeader'
import { InfoCard } from '../InfoCard'
import SpecList from './SpecList'

type CarSpecsProps = {
  carModel: CarModel
}

const CarSpecs: React.FC<CarSpecsProps> = ({ carModel }) => {
  const hpGain =
    carModel.hp && carModel.hpStage1 ? carModel.hpStage1 - carModel.hp : null
  const torqueGain =
    carModel.torque && carModel.torqueStage1
      ? carModel.torqueStage1 - carModel.torque
      : null
  const showReprog = hpGain && torqueGain

  return (
    <div className='text-black'>
      <div className='flex flex-row items-center justify-start space-x-3 lg:space-x-20'>
        <Link href={`/fiche-technique/${carModel.make.id}`}>
          <img
            src={`/car-makes/${carModel.make.id}.svg`}
            className='h-14 w-14 lg:h-20 lg:w-20'
          />
        </Link>
        <Link
          href='/fiche-technique'
          className='text-xs lg:text-base max-w-[60px] lg:max-w-[150px] underline'
        >
          Toutes les marques
        </Link>
        <span>{'>'}</span>
        <Link
          href={`/fiche-technique/${carModel.make.id}`}
          className='text-xl lg:text-3xl font-bold underline'
        >
          {carModel.make.name}
        </Link>
      </div>

      <p className='my-6 ml-1 lg:mt-8 text-2xl lg:text-4xl font-bold'>
        {carModel.model}
      </p>

      <SpecList engine={carModel} />

      <div className='mt-2 lg:mt-10'>
        <h2 className='text-2xl lg:text-4xl font-bold'>Potentiel du moteur</h2>

        {!showReprog && (
          <p className='mt-4 mb-20'>
            Le programme est en cours de développement, veuillez contacter notre
            partenaire pour plus d'informations..
          </p>
        )}

        {showReprog && (
          <table className='mb-12 text-sm lg:text-l font-bold mt-6 text-center lg:w-3/4 mx-auto border-collapse overflow-hidden shadow-lg rounded-lg'>
            <thead>
              <tr className='bg-blackopac text-white text-base lg:text-lg'>
                <th className='p-2 lg:p-3 lg:p-4'></th>
                <th className='border-b-4 p-2 lg:p-3 lg:p-4'>Origine</th>
                <th className='border-b-4 p-2 lg:p-3 lg:p-4 text-vividred'>
                  MAX
                </th>
                <th className='border-b-4 p-2 lg:p-3 lg:p-4 text-gold'>
                  Marge
                </th>
              </tr>
            </thead>
            <tbody className='lg:text-lg'>
              <tr className='bg-whiteopac hover:bg-blackopac2 transition-colors duration-200'>
                <td className='border-b-2 p-2 lg:p-3 lg:p-4'>Puissance</td>
                <td className='border-b-2 p-2 lg:p-3 lg:p-4'>
                  {carModel.hp} ch
                </td>
                <td className='border-b-2 p-2 lg:p-3 lg:p-4 text-vividred'>
                  {carModel.hpStage1} ch
                </td>
                <td className='border-b-2 p-2 lg:p-3 lg:p-4 text-gold'>
                  + {hpGain} ch
                </td>
              </tr>
              <tr className='bg-whiteBGDarker hover:bg-blackopac2 transition-colors duration-200'>
                <td className='border-b-2 p-2 lg:p-3 lg:p-4'>Couple</td>
                <td className='border-b-2 p-2 lg:p-3 lg:p-4'>
                  {carModel.torque} Nm
                </td>
                <td className='border-b-2 p-2 lg:p-3 lg:p-4 text-vividred'>
                  {carModel.torqueStage1} Nm
                </td>
                <td className='border-b-2 p-2 lg:p-3 lg:p-4 text-gold'>
                  + {torqueGain} Nm
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      <div className=''>
        <h2 className='text-2xl font-semibold mb-6'>Nos partenaires</h2>
        <ShopHeader
          id='autotech'
          name='Autotech Reprogrammation Moteur'
          phone='50 720 660'
          phoneText='RDV'
          location='https://www.google.com/maps/place/AutoTech+Reprogrammation+Moteur/@36.8799982,10.2991194,15z/data=!4m2!3m1!1s0x0:0x8e7d0ae9fd9aad0d?sa=X&ved=1t:2428&ictx=111'
          fb='https://www.facebook.com/autotechreprogrammation'
          insta='https://www.instagram.com/autotech_reprog'
          small={true}
          hasLogo={true}
        />
      </div>
    </div>
  )
}

export default CarSpecs
