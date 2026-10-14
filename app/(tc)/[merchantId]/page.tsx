import type { Metadata } from 'next'
import MerchantView, { merchantMetadata } from '../../_views/Merchant'

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
  return <MerchantView {...props} />
}
