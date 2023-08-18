interface CardProps {
  heading?: string
  title?: string
  link?: string
  image?: Image // TODO: REMOVE
  overlay_image?: Image // TODO: REMOVE
  card_image?: CardImageProps
}

interface CardImageProps {
  foreground: FileNode
  background: FileNode
  foreground_image: ImageDataLike
  background_image: ImageDataLike
  background_color: string
  alt: string
}

interface CardMeetingProps {
  meeting: {
    title: string
    time_start: string
    semester: string
    week_number: number
    image: Image
    slug: string
  }
  timezone: string
}

interface CardEventProps {
  event: {
    title: string
    time_start: string
    card_image: CardImageProps
    slug: string
  }
  timezone: string
}

interface CardPublicationProps {
  publication: {
    title: string
    date: string
    publisher: string
    publication_type: string
    card_image: CardImageProps
    slug: string
  }
}

interface CardSponsorProps {
  sponsor: {
    name: string
    card_image: CardImageProps
  }
}
