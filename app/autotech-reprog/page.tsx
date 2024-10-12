import { getCarMakes } from '../../api/services/car-makes.service'
import CarMakes from '../_components/car-specs/CarMakes'
import ShopHeader from '../_components/ShopHeader'

export default async function Autotech() {
  const carMakes = await getCarMakes(true)

  return (
    <>
      <ShopHeader
        id='autotech'
        name='Autotech Reprogrammation Moteur'
        phone='50 720 660'
        phoneText='RDV'
        location='https://www.google.com/maps/place/AutoTech+Reprogrammation+Moteur/@36.8799982,10.2991194,15z/data=!4m2!3m1!1s0x0:0x8e7d0ae9fd9aad0d?sa=X&ved=1t:2428&ictx=111'
        fb='https://www.facebook.com/autotechreprogrammation'
        insta='https://www.instagram.com/autotech_reprog'
      />
      <CarMakes carMakes={carMakes} />
    </>
  )
}
