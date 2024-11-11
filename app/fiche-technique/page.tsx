import { getCarMakes } from '../../api/services/car-makes.service'
import CarMakes from '../_components/car-specs/CarMakes'

export default async function Autotech() {
  const carMakes = await getCarMakes(true)

  return (
    <>
      <CarMakes carMakes={carMakes} />
    </>
  )
}
