import type { Metadata } from 'next'
import MerchantView, { merchantMetadata } from '../../_views/Merchant'

// Seller page on autocentral.tn (e.g. autocentral.tn/kamel-auto).
export async function generateMetadata({
  params
}: {
  params: { merchantId?: string }
}): Promise<Metadata> {
  return merchantMetadata(params.merchantId)
}

export default function MerchantPage(props: {
  searchParams: Record<string, string | string[] | undefined>
  params: { merchantId: string }
}) {
  return (
    <div className='min-h-screen w-full pb-10 pt-14 lg:pt-16'>
      <div className='mx-auto mt-4 w-[94%] sm:w-[92%] lg:mt-10 lg:w-[88%] xl:max-w-6xl'>
        <MerchantView {...props} />
      </div>
    </div>
  )
}
