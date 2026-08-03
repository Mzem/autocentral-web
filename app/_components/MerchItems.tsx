'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons'
import {
  faCartShopping,
  faShirt,
  faCarSide,
  faTrophy,
  faTag,
  faCircleCheck,
  faCircleXmark
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  MerchItem,
  MERCH_CATEGORIES
} from '../../api/services/merch-items.service'
import { dotNumber } from '../helpers'
import { messengerOrderUrl } from '../_lib/merch'
import MerchItemModal from './MerchItemModal'
import { AdminMerchControls } from './tunisiancars/AdminMerchControls'

const CATEGORY_ICONS: Record<string, IconDefinition> = {
  Vêtements: faShirt,
  Miniatures: faCarSide,
  Décoration: faTrophy,
  Accessoires: faTag
}

export const MerchItems = ({ merchItems }: { merchItems: MerchItem[] }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Group by category, in the canonical order, then anything else under "Autres".
  const known = new Set<string>(MERCH_CATEGORIES)
  const groups: { category: string; items: MerchItem[] }[] =
    MERCH_CATEGORIES.map((category) => ({
      category,
      items: merchItems.filter((i) => i.category === category)
    })).filter((g) => g.items.length > 0)
  const others = merchItems.filter((i) => !known.has(i.category))
  if (others.length > 0) groups.push({ category: 'Autres', items: others })

  const openItem = (id: string) => {
    setSelectedId(id)
    window.history.pushState(null, '', `/produits/${id}`)
  }

  return (
    <>
      <div className='space-y-12'>
        {groups.map((group) => (
          <section key={group.category}>
            <h2 className='flex items-center gap-2.5 text-lg font-extrabold lg:text-xl'>
              <FontAwesomeIcon
                icon={CATEGORY_ICONS[group.category] ?? faCartShopping}
                className='h-5 w-5 text-brand-500'
              />
              {group.category}
              <span className='text-sm font-medium text-ink-400'>
                ({group.items.length})
              </span>
            </h2>

            <ul className='mt-5 grid grid-cols-1 gap-5 md:grid-cols-2'>
              {group.items.map((item) => (
                <li
                  key={item.id}
                  className='group relative flex flex-col overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card-light transition hover:-translate-y-0.5 hover:shadow-lg'
                >
                  <AdminMerchControls item={item} />

                  <button
                    type='button'
                    onClick={() => openItem(item.id)}
                    className='block w-full text-left focus:outline-none'
                  >
                    <div className='aspect-square w-full overflow-hidden bg-ink-50'>
                      <img
                        src={item.images?.[0]}
                        alt={item.title}
                        className='h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105'
                      />
                    </div>
                    <div className='p-3'>
                      <h3 className='truncate text-sm font-bold lg:text-base'>
                        {item.title}
                      </h3>
                      <div className='mt-1 flex items-center justify-between gap-2'>
                        <span className='font-extrabold text-brand-600'>
                          {item.price
                            ? `${dotNumber(item.price)} DT`
                            : 'Prix N.C.'}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                            item.inStock ? 'text-emerald-600' : 'text-danger'
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={item.inStock ? faCircleCheck : faCircleXmark}
                            className='h-3 w-3'
                          />
                          {item.inStock ? 'En stock' : 'Rupture'}
                        </span>
                      </div>
                    </div>
                  </button>

                  <div className='mt-auto px-3 pb-3'>
                    <a
                      href={messengerOrderUrl(item)}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center justify-center gap-2 rounded-lg bg-[#1877F2] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0f66d0]'
                    >
                      <FontAwesomeIcon
                        icon={faFacebookMessenger}
                        className='h-4 w-4'
                      />
                      Commander
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {selectedId && (
        <MerchItemModal
          item={merchItems.find((i) => i.id === selectedId)!}
          onClose={() => {
            setSelectedId(null)
            window.history.replaceState(null, '', '/produits')
          }}
        />
      )}
    </>
  )
}
