'use client'

import { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faGears,
  faOilCan,
  faScrewdriverWrench,
  faShieldHalved,
  faSprayCan,
  faStar,
  faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons'

type Service = {
  icon: IconDefinition
  title: string
  text: string
  image: string
}

const SERVICES: Service[] = [
  {
    icon: faScrewdriverWrench,
    title: 'Restauration complète',
    text: 'Redonner vie à votre véhicule, de la carrosserie aux moindres finitions.',
    image: '/tunisiancars/services/restauration.jpg'
  },
  {
    icon: faGears,
    title: 'Mécanique',
    text: 'Diagnostic et interventions mécaniques par des experts.',
    image: '/tunisiancars/services/mecanique.jpg'
  },
  {
    icon: faOilCan,
    title: 'Vidange',
    text: 'Entretien moteur avec des produits adaptés à votre motorisation.',
    image: '/tunisiancars/services/vidange.jpg'
  },
  {
    icon: faSprayCan,
    title: 'Nettoyage profond',
    text: 'Detailing intérieur et extérieur, propreté irréprochable jusque dans les détails.',
    image: '/tunisiancars/services/nettoyage.jpg'
  },
  {
    icon: faWandMagicSparkles,
    title: 'Polissage',
    text: 'Correction des micro-rayures pour retrouver une carrosserie parfaite.',
    image: '/tunisiancars/services/polissage.png'
  },
  {
    icon: faStar,
    title: 'Lustrage',
    text: 'Une brillance profonde et durable, digne des plus belles pièces.',
    image: '/tunisiancars/services/lustrage.png'
  },
  {
    icon: faShieldHalved,
    title: 'Protection céramique',
    text: 'Un bouclier durable contre le temps, les rayures et les agressions.',
    image: '/tunisiancars/services/ceramique.png'
  }
]

// Gentle continuous scroll, in px added to scrollLeft each animation frame.
const SPEED = 0.6

/**
 * Prestations as an auto-scrolling (right-to-left) carousel that is also
 * hand-swipeable: native touch scroll on mobile, click-drag on desktop. The
 * list is doubled so the loop is seamless. Cards keep the exact same design;
 * their width (~85% mobile, ~47% desktop) shows the next one peeking so it's
 * clear the row can be swiped.
 */
export default function PrestationsCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const drag = useRef({ active: false, startX: 0, startScroll: 0 })

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    let raf = 0
    let loopWidth = 0
    const measure = () => {
      const first = el.children[0] as HTMLElement | undefined
      const marker = el.children[SERVICES.length] as HTMLElement | undefined
      loopWidth = first && marker ? marker.offsetLeft - first.offsetLeft : 0
    }
    measure()
    const step = () => {
      if (!pausedRef.current && loopWidth > 0) {
        el.scrollLeft += SPEED
        if (el.scrollLeft >= loopWidth) el.scrollLeft -= loopWidth
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
    }
  }, [])

  const pause = () => {
    pausedRef.current = true
  }
  const resume = () => {
    pausedRef.current = false
  }
  const endDrag = () => {
    drag.current.active = false
    pausedRef.current = false
  }

  const onPointerDown = (e: React.PointerEvent) => {
    pausedRef.current = true
    if (e.pointerType === 'mouse') {
      const el = scrollerRef.current
      if (!el) return
      drag.current = {
        active: true,
        startX: e.clientX,
        startScroll: el.scrollLeft
      }
    }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return
    const el = scrollerRef.current
    if (!el) return
    el.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX)
  }

  // Doubled so the seamless loop always has a next card to reveal.
  const items = [...SERVICES, ...SERVICES]

  return (
    <div
      ref={scrollerRef}
      onTouchStart={pause}
      onTouchEnd={resume}
      onTouchCancel={resume}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={() => drag.current.active && endDrag()}
      className='mt-2 flex cursor-grab select-none gap-5 overflow-x-auto active:cursor-grabbing lg:mt-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
    >
      {items.map((service, index) => (
        <div
          key={index}
          aria-hidden={index >= SERVICES.length}
          className='group relative w-[85%] shrink-0 overflow-hidden shadow-card-light ring-1 ring-ink-100 md:w-[47%]'
        >
          <div className='aspect-[4/3] overflow-hidden'>
            <img
              src={service.image}
              alt={service.title}
              loading='lazy'
              draggable={false}
              className='h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110'
            />
          </div>

          <div
            aria-hidden='true'
            className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent'
          />

          <div className='absolute inset-x-0 bottom-0 p-5'>
            <span className='inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur transition-colors duration-300 group-hover:bg-brand-500 group-hover:ring-brand-500'>
              <FontAwesomeIcon icon={service.icon} className='h-5 w-5' />
            </span>
            <h3 className='mt-3 text-lg font-bold text-white drop-shadow'>
              {service.title}
            </h3>
            <p className='mt-1 text-sm leading-relaxed text-white/80'>
              {service.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
