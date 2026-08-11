import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { ReactNode } from 'react'
import {
  faCalendarDays,
  faGaugeHigh,
  faGears,
  faLocationDot,
  faClock
} from '@fortawesome/free-solid-svg-icons'
import { MotoListItem } from '../../../api/services/moto-posts.service'
import { dotNumber, noPriceText } from '../../helpers'
import { SoldBadge } from '../car-posts/CarImage'
import CallButton from './CallButton'
import AdminMotoControls from './AdminMotoControls'

/**
 * Minimal motorcycle card (display-only): a 4:3 photo with price + "Appeler",
 * then a black spec panel (year / km / cc / region). Admin edit/delete/photos
 * controls overlay when a merchant is logged in.
 */
export default function MotoCard({ moto }: { moto: MotoListItem }) {
  const spec = (icon: IconDefinition, value: ReactNode) =>
    value ? (
      <span className='inline-flex items-center gap-0.5'>
        <FontAwesomeIcon icon={icon} className='h-3 w-3 text-white' />
        {value}
      </span>
    ) : null

  return (
    <div className='relative flex w-full flex-col overflow-hidden bg-black shadow-card-light'>
      <div className='relative aspect-[4/3] w-full overflow-hidden bg-ink-900'>
        {moto.image && (
          <img
            src={moto.image}
            alt={moto.title ?? `${moto.make ?? ''} ${moto.model ?? ''}`}
            className='h-full w-full object-cover'
          />
        )}
        {moto.isExpired && <SoldBadge className='absolute left-2.5 top-2.5' />}
        {!moto.isExpired && (
          <span className='absolute bottom-2.5 left-2.5 inline-flex items-center rounded-md bg-brand/50 px-2.5 py-1 text-xs font-extrabold text-white shadow'>
            {moto.price
              ? `${dotNumber(moto.price)} DT`
              : noPriceText('tunisian-cars')}
          </span>
        )}
        {!moto.isExpired && moto.phone && (
          <CallButton
            phone={moto.phone}
            className='absolute bottom-2.5 right-2.5'
          />
        )}
        <AdminMotoControls moto={moto} />
      </div>

      <div className='flex flex-col bg-blackopac3 px-3 py-2 text-white'>
        <h3 className='truncate text-sm font-bold leading-tight lg:text-base'>
          {moto.title ?? `${moto.make ?? ''} ${moto.model ?? ''}`.trim()}
        </h3>

        <div className='mt-0.5 flex flex-wrap items-center gap-x-2 text-[0.68rem] text-white/85 lg:text-xs'>
          {spec(faCalendarDays, moto.year)}
          {spec(
            faGaugeHigh,
            moto.km != null ? `${dotNumber(moto.km)} km` : null
          )}
          {spec(faGears, moto.cc ? `${moto.cc} cc` : null)}
        </div>

        <div className='mt-0.5 flex items-center gap-x-2 text-[0.68rem] text-white/85 lg:text-xs'>
          {spec(faLocationDot, moto.region?.name)}
        </div>

        {moto.publishedAtText && (
          <div className='mt-1 flex items-center gap-1 text-[0.6rem] text-white/55'>
            <FontAwesomeIcon icon={faClock} className='h-2.5 w-2.5' />
            Publié {moto.publishedAtText}
          </div>
        )}
      </div>
    </div>
  )
}
