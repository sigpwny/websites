interface Image {
  path: ImageDataLike
  alt: string
}

interface CardProps {
  heading?: string
  title?: string
  link?: string
  image?: Image
  overlay_image?: Image
  // images?: {
  //   full?: Image
  //   overlay?: Image
  // }
}