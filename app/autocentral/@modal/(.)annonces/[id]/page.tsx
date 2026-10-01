import CarPostDetail from '../../../../_components/tunisiancars/CarPostDetail'
import DetailModal from '../../../../_components/tunisiancars/DetailModal'

// Autocentral twin of the Tunisian Cars interceptor: in-app navigation to
// /annonces/[id] opens the listing as a modal over the current page (the URL
// still changes); a direct visit / refresh renders the full page instead.
export default function AnnonceModal({ params }: { params: { id: string } }) {
  return (
    <DetailModal>
      <CarPostDetail postId={params.id} />
    </DetailModal>
  )
}
