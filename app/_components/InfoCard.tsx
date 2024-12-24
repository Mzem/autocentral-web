export const InfoCard: React.FC<{
  img?: string
  title?: string
  value?: string | number
}> = ({ img, title, value }) => {
  return (
    <div className='shadow-lg p-2 bg-white rounded-lg flex flex-col items-center w-fit'>
      <div className='flex items-center justify-between w-full'>
        {img && <img className='h-3 mr-1' src={img} alt={title} />}
        {title && (
          <>
            <div className='font-bold'>{title}</div>
            {value && <span className='text-titan mx-[2px]'>|</span>}
          </>
        )}
        {value && <div className=''>{value}</div>}
      </div>
    </div>
  )
}
