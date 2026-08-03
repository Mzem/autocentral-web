import { getRegions, Region } from '../../../api/services/regions.service'
import { getCarMakes, CarMake } from '../../../api/services/car-makes.service'
import NewCarForm from '../../_components/tunisiancars/NewCarForm'

const SHOP_MERCHANT_ID = 'tunisian-cars'

export const dynamic = 'force-dynamic'

export default async function NewCarPage() {
  // Loaded independently so one endpoint failing never blanks the other's
  // dropdown (empty selects degrade gracefully).
  const [regionsRes, makesRes] = await Promise.allSettled([
    getRegions(),
    getCarMakes()
  ])
  const regions: Region[] =
    regionsRes.status === 'fulfilled' ? regionsRes.value : []
  const makes: CarMake[] = makesRes.status === 'fulfilled' ? makesRes.value : []

  return (
    <div className='min-h-screen bg-white pt-14 text-ink-950 lg:pt-16'>
      <div className='mx-auto w-[92%] max-w-4xl py-8 lg:py-12'>
        <NewCarForm
          regions={regions}
          makes={makes}
          merchantId={SHOP_MERCHANT_ID}
        />
      </div>
    </div>
  )
}
