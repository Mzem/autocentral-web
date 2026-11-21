import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import {
  CarPriceEstimate,
  estimateCarPrice
} from '../../../../api/services/car-posts.service'
import {
  estimateCarLabel,
  isCompleteEstimate,
  parseEstimateParams
} from '../../../_lib/estimate'
import { dotNumber } from '../../../helpers'

/**
 * Preview image (1200x630) of a shared estimate: the car, its estimated range
 * and how many comparable listings it is based on. Linked from the metadata of
 * /estimation?… so WhatsApp / Messenger / Facebook show it with the link.
 */
export async function GET(req: NextRequest) {
  const params = parseEstimateParams(
    Object.fromEntries(req.nextUrl.searchParams.entries())
  )

  let estimate: CarPriceEstimate | null = null
  if (isCompleteEstimate(params)) {
    try {
      estimate = await estimateCarPrice({
        make: params.make!,
        model: params.model!,
        year: Number(params.year),
        km: Number(params.km),
        cv: Number(params.cv),
        fuel: params.fuel,
        gearbox: params.gearbox,
        firstOwner: params.firstOwner,
        fullOptions: params.fullOptions,
        specialVersion: params.specialVersion
      })
    } catch {
      estimate = null
    }
  }

  const car = estimateCarLabel(params) || 'Mon véhicule'
  const range =
    estimate?.enough && estimate.low && estimate.high
      ? `${dotNumber(estimate.low)} – ${dotNumber(estimate.high)} DT`
      : null

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background:
            'radial-gradient(80% 120% at 100% 100%, #5a1a17 0%, #1a0907 45%, #000 75%)',
          color: '#fff',
          fontFamily: 'sans-serif'
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 6,
            color: '#e0453a'
          }}
        >
          ESTIMATION AUTOCENTRAL
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 52, fontWeight: 800 }}>
            {car}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 24,
              fontSize: range ? 92 : 48,
              fontWeight: 800,
              color: range ? '#ff5a4d' : 'rgba(255,255,255,0.7)'
            }}
          >
            {range ?? 'Prix du marché en Tunisie'}
          </div>
          {estimate?.enough && (
            <div
              style={{
                display: 'flex',
                marginTop: 16,
                fontSize: 30,
                color: 'rgba(255,255,255,0.7)'
              }}
            >
              {`Médiane ${dotNumber(estimate.mid)} DT · ${
                estimate.sampleSize
              } annonces comparables`}
            </div>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: 'rgba(255,255,255,0.55)'
          }}
        >
          autocentral.tn · voir les véhicules similaires
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // Market prices move slowly: let crawlers / CDNs reuse it for a day.
      headers: { 'Cache-Control': 'public, max-age=86400' }
    }
  )
}
