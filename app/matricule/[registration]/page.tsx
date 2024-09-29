import { getCarReg } from '../../../api/services/car-reg.service'

export default async function FicheTechniqueMake({
  params
}: {
  params: { registration: string }
}) {
  const carReg = await getCarReg(params.registration)

  return (
    <div className='text-center'>
      {!carReg && <p>Aucune donnée pour {params.registration}</p>}
      {carReg && (
        <div>
          <p>{carReg.make}</p>
          <p>{carReg.registration}</p>
          <p>{carReg.registrationDate}</p>
        </div>
      )}
    </div>
  )
}
