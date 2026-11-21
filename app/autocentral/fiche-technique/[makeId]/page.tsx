import type { Metadata } from 'next'
import { getCarModelsByMake } from '../../../../api/services/car-model.service'
import CarModelList from '../../../_components/car-specs/CarModelList'
import { AC_URL } from '../../../_lib/site'

export function generateMetadata({
  params
}: {
  params: { makeId: string }
}): Metadata {
  return {
    alternates: { canonical: `${AC_URL}/fiche-technique/${params.makeId}` }
  }
}

export default async function AcFicheTechniqueMake({
  params
}: {
  params: { makeId: string }
}) {
  const carModels = await getCarModelsByMake(params.makeId)
  return (
    <div className='min-h-screen w-full bg-black pb-10 pt-14 lg:pt-16'>
      <div className='mx-auto mt-4 w-[94%] sm:w-[92%] lg:mt-10 lg:w-[88%] xl:max-w-6xl'>
        {carModels && <CarModelList modelsByMake={carModels} />}
      </div>
    </div>
  )
}
