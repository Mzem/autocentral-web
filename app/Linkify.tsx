const urlRegex = /(https?:\/\/[^\s]+)/g

export const Linkify: React.FC<{ text: string }> = ({ text }) => {
  // Split the text by URLs and wrap URLs with <a> tags
  const parts = text.split(urlRegex).map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target='_blank'
          rel='noopener noreferrer'
          className='text-vividred underline'
        >
          {part.length > 25 ? part.slice(0, 25) + '...' : part}
        </a>
      )
    }
    return part
  })

  return <>{parts}</>
}
