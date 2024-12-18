import { Color } from '../types'

const colorHexMap: Record<Color, string> = {
  [Color.BLACK]: '#000000',
  [Color.WHITE]: '#FFFFFF',
  [Color.RED]: '#d13030',
  [Color.GREEN]: '#077007',
  [Color.BLUE]: '#1b1bbf',
  [Color.YELLOW]: '#d9d91c',
  [Color.BROWN]: '#965824',
  [Color.GREY]: '#9c9797'
}

export default function ColorSelector({
  selectedColors,
  setSelectedColors
}: {
  selectedColors: Color[]
  setSelectedColors: (colors: Color[]) => void
}) {
  const toggleColorSelection = (color: Color) => {
    if (selectedColors.includes(color)) {
      // Remove color if it is already selected
      setSelectedColors(selectedColors.filter((c) => c !== color))
    } else {
      // Add color if it is not selected
      setSelectedColors([...selectedColors, color])
    }
  }

  return (
    <div className='mt-1 ml-3 flex space-x-[3px] items-center'>
      <span className='text-sm lg:text-base text-whiteBG mr-1'>Couleur</span>
      {Object.entries(colorHexMap).map(([colorKey, hex]) => (
        <div
          key={colorKey}
          onClick={() => toggleColorSelection(colorKey as Color)}
          style={{
            backgroundColor: hex,
            width: '20px',
            height: '20px',
            borderRadius: '10%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          {selectedColors.includes(colorKey as Color) && (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill={`${
                [Color.WHITE, Color.YELLOW].includes(colorKey as Color)
                  ? 'black'
                  : 'white'
              }`}
              className='w-7 h-7 absolute'
            >
              <path d='M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4L9 16.2z' />
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}
