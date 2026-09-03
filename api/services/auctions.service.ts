import { apiGet } from 'api/apiClient'

/** One VIN decoded by the API (GPT), for lots bundling several vehicles. */
export interface DecodedVin {
  vin: string
  make?: string
  model?: string
  year?: number
  engine?: string
  fuel?: string
  body?: string
  country?: string
  details?: string
}

/** Vehicle lot from a Tunisian public auction (Douane / JORT via encheres.tn). */
export interface AuctionVehicle {
  id: string
  source: string | null // 'douane' | 'jort'
  lot: string | null
  categorie: string | null
  description: string | null
  miseAPrix: number | null // 0 = "meilleure offre"
  caution: number | null
  sourceUrl: string | null // official notice PDF ("avis")
  detailUrl: string | null // lot page on encheres.tn
  datePublication: string | null // YYYY-MM-DD
  dernierDelai: string | null // YYYY-MM-DD
  organisme: string | null
  ville: string | null
  lieu: string | null
  avis: string | null
  vins: string[]
  make: string | null
  model: string | null
  year: number | null
  engine: string | null
  fuel: string | null
  body: string | null
  country: string | null
  extra: string | null
  decoded: DecodedVin[] | null
  decodedAt: string | null
  isExpired: boolean
}

export async function getAuctions(
  cacheInSeconds = 600
): Promise<AuctionVehicle[]> {
  try {
    const { content } = await apiGet<AuctionVehicle[]>(
      'auctions',
      cacheInSeconds
    )
    return Array.isArray(content) ? content : []
  } catch (e) {
    console.error('GET auctions error')
    return []
  }
}
