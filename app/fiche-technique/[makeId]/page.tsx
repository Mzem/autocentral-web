import { getCarModelsByMake } from '../../../api/services/car-model.service'
import FichesTechniques from '../../_components/FichesTechniques'

export default async function FicheTechniqueMake({
  params
}: {
  params: { makeId: string }
}) {
  const carModels = await getCarModelsByMake(params.makeId)

  return <>{carModels && <FichesTechniques modelsByMake={carModels} />}</>
}