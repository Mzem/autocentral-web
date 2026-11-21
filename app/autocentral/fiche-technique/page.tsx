import type { Metadata } from 'next'
import { getCarMakes } from '../../../api/services/car-makes.service'
import CarMakes from '../../_components/car-specs/CarMakes'
import { acPageMetadata } from '../../_lib/site-metadata'

// Moved from tunisiancars.com.tn/fiche-technique (redirected here).
export const metadata: Metadata = acPageMetadata({
  title: 'Fiches techniques & motorisations | Autocentral',
  description:
    'Fiches techniques des voitures en Tunisie : motorisations, puissance, consommation et fiabilité, par marque et par modèle.',
  path: '/fiche-technique'
})

export default async function AcFichesTechniques() {
  const carMakes = await getCarMakes(true)
  return (
    <div className='min-h-screen w-full bg-black pb-10 pt-14 lg:pt-16'>
      <div className='mx-auto mt-4 w-[94%] sm:w-[92%] lg:mt-10 lg:w-[88%] xl:max-w-6xl'>
        <CarMakes carMakes={carMakes} />
      </div>
    </div>
  )
}
