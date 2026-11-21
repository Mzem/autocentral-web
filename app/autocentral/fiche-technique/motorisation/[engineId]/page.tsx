import type { Metadata } from 'next'
import { getCarModel } from '../../../../../api/services/car-model.service'
import CarSpecs from '../../../../_components/car-specs/CarSpecs'
import { AC_URL } from '../../../../_lib/site'

export async function generateMetadata({
  params
}: {
  params: { engineId: string }
}): Promise<Metadata> {
  const url = `${AC_URL}/fiche-technique/motorisation/${params.engineId}`
  const carModel = await getCarModel(params.engineId)
  if (!carModel) return { alternates: { canonical: url } }
  const name = [carModel.make.name, carModel.model, carModel.type]
    .filter(Boolean)
    .join(' ')
  const title = `Fiche technique ${name} | Autocentral`
  return {
    title,
    description: `Fiche technique ${name} : motorisation, puissance, consommation et fiabilité.`,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      siteName: 'Autocentral',
      images: `/car-makes/${carModel.make.id}.svg`
    }
  }
}

export default async function AcFicheTechniqueEngine({
  params
}: {
  params: { engineId: string }
}) {
  const carModel = await getCarModel(params.engineId)
  return (
    <div className='min-h-screen w-full bg-black pb-10 pt-14 lg:pt-16'>
      <div className='mx-auto mt-4 w-[94%] sm:w-[92%] lg:mt-10 lg:w-[88%] xl:max-w-6xl'>
        {carModel && <CarSpecs carModel={carModel} />}
      </div>
    </div>
  )
}
