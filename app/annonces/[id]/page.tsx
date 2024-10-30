import CarPostModal from '../../_components/car-posts/CarPostModal'

export default async function Annonce({ params }: { params: { id: string } }) {
  return (
    <>
      <CarPostModal postId={params.id} isFull={true} />
    </>
  )
}
