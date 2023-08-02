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
  meeting: Queries.Meeting
  timezone: string
}

interface CardEventProps {
  event: Queries.Event
  timezone: string
}

interface CardPublicationProps {
  publication: Queries.Publication
  timezone: string
}
