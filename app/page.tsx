import FullScreenImage from "./modules/FullScreenImage"

export default function Home() {
  const imageUrl = "cover.jpg" // Provide the URL of the image

  return (
    <div>
      <FullScreenImage imageUrl={imageUrl} />
    </div>
  )
}
