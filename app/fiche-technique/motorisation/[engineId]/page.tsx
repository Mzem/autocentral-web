import { Metadata } from 'next'
import { getCarModel } from '../../../../api/services/car-model.service'
import CarSpecs from '../../../_components/car-specs/CarSpecs'

export async function generateMetadata({
  params
}: {
  params: { engineId?: string }
}): Promise<Metadata> {
  const carModel = params.engineId ? await getCarModel(params.engineId) : null
  if (carModel) {
    return {
      alternates: {
        canonical: params.engineId
          ? `https://autocentral.tn/fiche-technique/motorisation/${params.engineId}`
          : 'https://autocentral.tn'
      },
      description: `Fiche technique ${carModel.make.name} ${carModel.model} ${
        carModel.type ? ' ' + carModel.type : ''
      }`,
      openGraph: {
        type: 'website',
        url: params.engineId
          ? `https://autocentral.tn/fiche-technique/motorisation/${params.engineId}`
          : 'https://autocentral.tn',
        title: `Fiche technique ${carModel.make.name} ${carModel.model} ${
          carModel.type ? ' ' + carModel.type : ''
        }`,
        siteName: `Fiche technique ${carModel.make.name} ${carModel.model} ${
          carModel.type ? ' ' + carModel.type : ''
        }`,
        images: `/car-makes/${carModel.make.id}.svg` || '/logo_rect.jpg'
      }
    }
  }

  return {
    description: 'Vendeur occasion en Tunisie',
    alternates: {
      canonical: params.engineId
        ? `https://autocentral.tn/fiche-technique/motorisation/${params.engineId}`
        : 'https://autocentral.tn'
    }
  }
}

export default async function FicheTechniqueMake({
  params
}: {
  params: { engineId: string }
}) {
  const carModel = await getCarModel(params.engineId)

  return <>{carModel && <CarSpecs carModel={carModel} />}</>
}
