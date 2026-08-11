import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const InfoCard: React.FC<{
  icon?: IconDefinition
  title?: string
  value?: string | number
}> = ({ icon, title, value }) => {
  return (
    <div className='shadow-lg p-2 bg-surface rounded-lg flex flex-col items-center w-fit'>
      <div className='flex items-center justify-between w-full'>
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            aria-hidden='true'
            className='h-3 mr-1 text-white'
          />
        )}
        {title && (
          <>
            <div className='font-bold'>{title}</div>
            {value && <span className='text-white/70 mx-[2px]'>|</span>}
          </>
        )}
        {value && <div className=''>{value}</div>}
      </div>
    </div>
  )
}
