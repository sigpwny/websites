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
}
