import { getCarModel } from '../../../../api/services/car-model.service'
import CarSpecs from '../../../_components/car-specs/CarSpecs'

export default async function FicheTechniqueMake({
  params
}: {
  params: { engineId: string }
}) {
  const carModel = await getCarModel(params.engineId)

  return <>{carModel && <CarSpecs carModel={carModel} />}</>
}
