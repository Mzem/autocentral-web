import { Metadata } from 'next'
import { getCarMakes } from '../../api/services/car-makes.service'
import CarMakes from '../_components/car-specs/CarMakes'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Fiche technique Tunisie',
    alternates: {
      canonical: 'https://autocentral.tn/fiche-technique'
    }
  }
}

export default async function FichesTechniques() {
  const carMakes = await getCarMakes(true)

  return (
    <>
      <CarMakes carMakes={carMakes} />
    </>
  )
}
