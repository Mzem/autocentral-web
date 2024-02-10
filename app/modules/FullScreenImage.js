import React from "react"
import styles from "./FullScreenImage.module.css" // Import CSS module for styling

const FullScreenImage = ({ imageUrl }) => {
  return (
    <div className={styles.fullScreenContainer}>
      <img src={imageUrl} className={styles.fullScreenImage} />
    </div>
  )
}

export default FullScreenImage
