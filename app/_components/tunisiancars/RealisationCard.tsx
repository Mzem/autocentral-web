import { RealisationItem } from '../../../api/services/realisations.service'
import AdminRealisationControls from './AdminRealisationControls'

/** Réalisation card: a photo on top, then title + (clamped) description. */
export default function RealisationCard({ item }: { item: RealisationItem }) {
  return (
    <div className='group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-card-light ring-1 ring-ink-100'>
      <div className='relative aspect-[4/3] overflow-hidden bg-ink-100'>
        {item.image && (
          <img
            src={item.image}
            alt={item.title ?? 'Réalisation'}
            loading='lazy'
            className='h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105'
          />
        )}
        <AdminRealisationControls item={item} />
      </div>

      {(item.title || item.description) && (
        <div className='flex flex-1 flex-col p-4'>
          {item.title && (
            <h3 className='line-clamp-2 text-base font-bold text-ink-950'>
              {item.title}
            </h3>
          )}
          {item.description && (
            <p className='mt-1.5 line-clamp-4 whitespace-pre-line text-sm leading-relaxed text-ink-600'>
              {item.description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
