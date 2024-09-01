import { getCarMakes } from '../api/services/car-makes.service'
import CarMakes from './_components/CarMakes'
import CarReg from './_components/CarReg'
import Header from './_components/Header'

export default async function Home() {
  const carMakes = await getCarMakes()

  return (
    <div>
      <Header />
      <div className='pt-14'>
        <CarReg />
        <CarMakes carMakes={carMakes} />
      </div>
    </div>
  )
}
