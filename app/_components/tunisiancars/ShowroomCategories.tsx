'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faChevronDown,
  faCircleCheck,
  faUserTie
} from '@fortawesome/free-solid-svg-icons'
import { CarPostListItem } from '../../../api/services/car-posts.service'
import ShowroomCars from './ShowroomCars'

/** Collapsible "sold vehicles" block - hidden by default, revealed on click. */
function SoldReveal({ sold }: { sold: CarPostListItem[] }) {
  const [open, setOpen] = useState(false)
  if (sold.length === 0) return null
  return (
    <div className='mt-5'>
      <button
        type='button'
        onClick={() => setOpen((o) => !o)}
        className='rounded-full border border-ink-200 px-4 py-2 text-left text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50'
      >
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`mr-2 inline-block h-3.5 w-3.5 align-[-0.05em] text-brand-500 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
        {open ? 'Masquer' : 'Voir'} les véhicules déjà vendus ({sold.length})
      </button>
      {open && (
        <div className='mt-6'>
          <ShowroomCars posts={sold} />
        </div>
      )}
    </div>
  )
}

function Category({
  icon,
  title,
  subtitle,
  posts,
  emptyInvite
}: {
  icon: IconDefinition
  title: string
  subtitle?: string
  posts: CarPostListItem[]
  emptyInvite: string
}) {
  const available = posts.filter((p) => !p.isExpired)
  const sold = posts.filter((p) => p.isExpired)

  return (
    <section>
      <header>
        <h2 className='text-lg font-bold tracking-tight lg:text-xl'>
          <FontAwesomeIcon
            icon={icon}
            className='mr-2 inline-block h-5 w-5 text-brand-500'
          />
          {title}
        </h2>
        {subtitle && <p className='mt-1.5 text-sm text-ink-500'>{subtitle}</p>}
      </header>

      {available.length > 0 ? (
        <div className='mt-2 lg:mt-6'>
          <ShowroomCars posts={available} />
        </div>
      ) : (
        <p className='mt-5 rounded-2xl bg-ink-50 px-6 py-10 text-center text-sm text-ink-500'>
          {emptyInvite}
        </p>
      )}

      <SoldReveal sold={sold} />
    </section>
  )
}

/**
 * Home showroom split into two categories: cars sold by Tunisian Cars itself,
 * and cars sold on behalf of their owners. Sold vehicles are hidden by default
 * in each category behind a reveal toggle.
 */
export default function ShowroomCategories({
  posts
}: {
  posts: CarPostListItem[]
}) {
  const own = posts.filter((p) => !p.isOnBehalf)
  const onBehalf = posts.filter((p) => p.isOnBehalf)

  return (
    <div className='space-y-10 lg:space-y-14'>
      <Category
        icon={faCircleCheck}
        title='Véhicules inspectés et vendus par Tunisian Cars'
        posts={own}
        emptyInvite='Aucun véhicule disponible pour le moment.'
      />
      <Category
        icon={faUserTie}
        title='Véhicules vendus directement par leur propriétaires'
        subtitle='Veuillez nous contacter pour ajouter le vôtre'
        posts={onBehalf}
        emptyInvite='Aucune annonce de propriétaire pour le moment - contactez-nous pour ajouter la vôtre'
      />
    </div>
  )
}
