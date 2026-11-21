'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

/**
 * Dual-thumb range slider (min + max) with a filled active track. Both thumbs
 * stay draggable thanks to the `.range-thumb` CSS (pointer-events on the thumbs
 * only). The parent owns the values and maps the bounds to "no filter".
 * `light` = drawn on a light background (default: on a dark one).
 */
export default function RangeSlider({
  label,
  icon,
  unit,
  min,
  max,
  step,
  valueMin,
  valueMax,
  onChange,
  format,
  light = false
}: {
  label: string
  icon?: IconDefinition
  unit?: string
  min: number
  max: number
  step: number
  valueMin: number
  valueMax: number
  onChange: (lo: number, hi: number) => void
  format?: (n: number) => string
  light?: boolean
}) {
  const fmt = format ?? ((n: number) => `${n}`)
  const pct = (v: number) => ((v - min) / (max - min)) * 100
  // The browser moves a native thumb's CENTRE over [half thumb, width - half
  // thumb], not [0, width]. Drawing ours on the same span keeps the red circle
  // exactly over the (invisible) draggable one. THUMB = .range-thumb size (css).
  const THUMB = 22
  const at = (v: number) =>
    `calc(${THUMB / 2}px + (100% - ${THUMB}px) * ${pct(v) / 100})`

  return (
    <div>
      <div className='flex items-center justify-between text-sm'>
        <span className='flex items-center gap-2 font-semibold'>
          {icon && (
            <FontAwesomeIcon
              icon={icon}
              className='h-3.5 w-3.5 text-brand-500'
            />
          )}
          {label}
        </span>
        <span
          className={`font-medium ${light ? 'text-ink-500' : 'text-white/70'}`}
        >
          {fmt(valueMin)} – {fmt(valueMax)}
          {valueMax >= max ? '+' : ''}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>

      <div className='relative mt-2 h-5'>
        {/* Track */}
        <div
          className={`absolute top-1/2 h-1 -translate-y-1/2 rounded ${
            light ? 'bg-ink-200' : 'bg-white/15'
          }`}
          style={{ left: THUMB / 2, right: THUMB / 2 }}
        />
        {/* Active fill */}
        <div
          className='absolute top-1/2 h-1 -translate-y-1/2 rounded bg-brand-500'
          style={{
            left: at(valueMin),
            width: `calc((100% - ${THUMB}px) * ${
              (pct(valueMax) - pct(valueMin)) / 100
            })`
          }}
        />
        {/* Visible thumbs, on the same span as the native (invisible) ones */}
        <div
          className='pointer-events-none absolute top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-500 bg-white shadow'
          style={{ left: at(valueMin) }}
        />
        <div
          className='pointer-events-none absolute top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-500 bg-white shadow'
          style={{ left: at(valueMax) }}
        />
        {/* Invisible native inputs handle dragging only */}
        <input
          type='range'
          aria-label={`${label} minimum`}
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={(e) =>
            onChange(Math.min(Number(e.target.value), valueMax), valueMax)
          }
          className='range-thumb absolute top-0 h-5 w-full'
        />
        <input
          type='range'
          aria-label={`${label} maximum`}
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={(e) =>
            onChange(valueMin, Math.max(Number(e.target.value), valueMin))
          }
          className='range-thumb absolute top-0 h-5 w-full'
        />
      </div>
    </div>
  )
}
