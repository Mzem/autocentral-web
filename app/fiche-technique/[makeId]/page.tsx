import { Metadata } from 'next'
import { getCarModelsByMake } from '../../../api/services/car-model.service'
import FichesTechniques from '../../_components/car-specs/CarModelList'

export async function generateMetadata({
  params
}: {
  params: { makeId?: string }
}): Promise<Metadata> {
  return {
    alternates: {
      canonical: params.makeId
        ? `https://autocentral.tn/fiche-technique/${params.makeId}`
        : 'https://autocentral.tn'
    }
  }
}

export default async function FicheTechniqueMake({
  params
}: {
  params: { makeId: string }
}) {
  const carModels = await getCarModelsByMake(params.makeId)

  return <>{carModels && <FichesTechniques modelsByMake={carModels} />}</>
}
