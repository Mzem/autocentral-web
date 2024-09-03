import { getCarMakes } from '../api/services/car-makes.service'
import CarMakes from './_components/CarMakes'
import CarReg from './_components/CarReg'

export default async function Home() {
  const carMakes = await getCarMakes(true)

  return (
    <>
      <CarReg />
      <CarMakes carMakes={carMakes} />
    </>
  )
}
