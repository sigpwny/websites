interface Image {
  path: ImageDataLike
  alt: string
}

interface CardProps {
  heading: string
  title: string
  image: Image
  link?: string
}