import Vendeurs, { vendeursMetadata } from '../../_views/Vendeurs'

export const metadata = vendeursMetadata

export default function VendeursPage() {
  return (
    <div className='min-h-screen w-full pb-10 pt-14 lg:pt-16'>
      <div className='mx-auto mt-4 w-[94%] sm:w-[92%] lg:mt-10 lg:w-[88%] xl:max-w-6xl'>
        <Vendeurs site='ac' />
      </div>
    </div>
  )
}
