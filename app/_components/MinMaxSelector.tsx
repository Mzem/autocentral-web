export default function MinMaxSelector({
  min,
  max,
  setMin,
  setMax,
  minValue = 0,
  maxValue = 10000000,
  label
}: {
  min?: number
  max?: number
  setMin: (min: number | undefined) => void
  setMax: (max: number | undefined) => void
  minValue?: number
  maxValue?: number
  label: string
}) {
  return (
    <div className='mt-1 ml-3 flex items-center'>
      <span
        className={`text-xs lg:text-sm text-whiteBG ${
          label.length < 4 ? 'mr-[7px]' : 'mr-1'
        }`}
      >
        {label} min.
      </span>
      <input
        type='number'
        inputMode='numeric'
        value={min || ''}
        onChange={(e) => {
          const input = Number(e.target.value)
          if (!input) setMin(undefined)
          if (input >= minValue && input <= maxValue) setMin(input)
        }}
        className={`rounded w-${
          maxValue < 10000 ? (maxValue < 1000 ? '10' : '16') : '20'
        } h-4 text-black mr-1 p-1 text-right`}
      />
      <span
        className={`text-xs lg:text-sm text-whiteBG ${
          label.length < 4 ? 'mr-[8px]' : 'mr-1'
        }`}
      >
        {label} max.
      </span>
      <input
        type='number'
        inputMode='numeric'
        value={max || ''}
        onChange={(e) => {
          const input = Number(e.target.value)
          if (!input) setMax(undefined)
          if (input >= minValue && input <= maxValue) setMax(input)
        }}
        className={`rounded w-${
          maxValue < 10000 ? (maxValue < 1000 ? '10' : '16') : '20'
        } h-4 text-black p-1 text-right`}
      />
    </div>
  )
}
