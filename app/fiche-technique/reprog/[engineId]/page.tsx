import { getCarModel } from '../../../../api/services/car-model.service'
import FicheTechnique from '../../../_components/FicheTechnique'

export default async function FicheTechniqueMake({
  params
}: {
  params: { engineId: string }
}) {
  const carModel = await getCarModel(params.engineId)

  return <>{carModel && <FicheTechnique carModel={carModel} />}</>
}
