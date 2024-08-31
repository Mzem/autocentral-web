import React, { useState, useEffect, MouseEventHandler } from 'react'

const ProgressiveImage = ({
  src,
  placeholder,
  alt,
  onClick,
  className,
}: {
  src: string
  placeholder: string
  alt: string
  onClick: MouseEventHandler
  className: string
}) => {
  const [currentSrc, setCurrentSrc] = useState(placeholder)

  useEffect(() => {
    const image = new Image()
    image.src = src

    image.onload = () => {
      setCurrentSrc(src)
    }

    return () => {
      image.onload = null // Cleanup to prevent memory leaks
    }
  }, [src])

  return (
    <img src={currentSrc} alt={alt} onClick={onClick} className={className} />
  )
}

export default ProgressiveImage
