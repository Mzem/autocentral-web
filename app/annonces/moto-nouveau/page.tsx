import { getRegions, Region } from '../../../api/services/regions.service'
import NewMotoForm from '../../_components/tunisiancars/NewMotoForm'

export const dynamic = 'force-dynamic'

export default async function NewMotoPage() {
  const regionsRes = await Promise.allSettled([getRegions()])
  const regions: Region[] =
    regionsRes[0].status === 'fulfilled' ? regionsRes[0].value : []

  return (
    <div className='min-h-screen bg-white pt-14 text-ink-950 lg:pt-16'>
      <div className='mx-auto w-[92%] max-w-4xl py-8 lg:py-12'>
        <NewMotoForm regions={regions} />
      </div>
    </div>
  )
}
