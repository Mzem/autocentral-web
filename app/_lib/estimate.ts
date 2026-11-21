/**
 * Parameters of a price estimate, as carried in the /estimation URL. The same
 * URL is used by the "Estimer" buttons of the listings (pre-filled from the
 * listing, the result is shown straight away) and by "Partager mon
 * estimation": opening it recomputes the estimate and the comparable cars.
 */
export type EstimateParams = {
  make?: string
  model?: string
  year?: string
  km?: string
  cv?: string
  fuel?: string
  gearbox?: string
  firstOwner?: boolean
  fullOptions?: boolean
  specialVersion?: boolean
}

const TEXT_KEYS = [
  'make',
  'model',
  'year',
  'km',
  'cv',
  'fuel',
  'gearbox'
] as const
const FLAG_KEYS = ['firstOwner', 'fullOptions', 'specialVersion'] as const

/** Enough to run an estimate (same rule as the form). */
export const isCompleteEstimate = (p: EstimateParams): boolean =>
  !!(p.make && p.model && p.year && p.km && p.cv)

export function estimateQueryString(p: EstimateParams): string {
  const qs = new URLSearchParams()
  for (const k of TEXT_KEYS) {
    const v = p[k]?.toString().trim()
    if (v) qs.set(k, v)
  }
  for (const k of FLAG_KEYS) if (p[k]) qs.set(k, 'true')
  return qs.toString()
}

/** `/estimation?…` (relative: on tunisiancars.com.tn the middleware sends it
 *  to autocentral.tn). */
export const estimationPath = (p: EstimateParams): string => {
  const qs = estimateQueryString(p)
  return qs ? `/estimation?${qs}` : '/estimation'
}

type SearchParamsLike = Record<string, string | string[] | undefined>

export function parseEstimateParams(sp: SearchParamsLike): EstimateParams {
  const one = (k: string) => {
    const v = sp[k]
    const s = (Array.isArray(v) ? v[0] : v)?.trim()
    return s ? s.slice(0, 60) : undefined
  }
  const out: EstimateParams = {}
  for (const k of TEXT_KEYS) out[k] = one(k)
  for (const k of FLAG_KEYS) out[k] = one(k) === 'true'
  return out
}

type PostLike = {
  make?: string | null
  model?: string | null
  year?: number | null
  km?: number | null
  cv?: number | null
  fuel?: string | null
  gearbox?: string | null
}

/** Pre-fill from a listing (whatever it has; the form asks for the rest). */
export function estimateParamsFromPost(post: PostLike): EstimateParams {
  const num = (n?: number | null) => (n != null && n > 0 ? String(n) : '')
  return {
    make: post.make ?? '',
    model: post.model ?? '',
    year: num(post.year),
    km: num(post.km),
    cv: num(post.cv),
    fuel: post.fuel ?? '',
    gearbox: post.gearbox ?? ''
  }
}

/** "Volkswagen Golf 7 · 2015 · 120 000 km" */
export function estimateCarLabel(p: EstimateParams): string {
  const km = Number(p.km)
  return [
    [p.make, p.model].filter(Boolean).join(' '),
    p.year,
    km ? `${String(km).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} km` : ''
  ]
    .filter(Boolean)
    .join(' · ')
}
