import CarPostDetail from '../../../_components/tunisiancars/CarPostDetail'
import DetailModal from '../../../_components/tunisiancars/DetailModal'

// Intercepts client navigation to /annonces/[id] and shows it as a modal
// overlay (the URL still becomes /annonces/[id]); a direct visit / refresh
// falls through to the real page. The modal opens instantly and the detail is
// fetched on the client (with a loading skeleton) — no server round-trip blocks
// the overlay from appearing.
export default function AnnonceModal({ params }: { params: { id: string } }) {
  return (
    <DetailModal>
      <CarPostDetail postId={params.id} />
    </DetailModal>
  )
}
