import MotoDetail from '../../../../_components/tunisiancars/MotoDetail'
import DetailModal from '../../../../_components/tunisiancars/DetailModal'

// Intercepts client navigation to /annonces/moto/[id] and shows it as a modal
// overlay (URL still becomes /annonces/moto/[id]); a direct visit / refresh
// falls through to the real page. Mirrors the car @modal/(.)annonces/[id].
export default function MotoModal({ params }: { params: { id: string } }) {
  return (
    <DetailModal>
      <MotoDetail motoId={params.id} />
    </DetailModal>
  )
}
