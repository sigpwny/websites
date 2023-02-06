import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

interface Props {
  includeSeries?: string[]
  excludeSeries?: string[]
}

type Event = Queries.EventCardsQuery["allEvent"]["events"][0]

const EventCards = ({ includeSeries, excludeSeries }: Props) => {
  const data = useStaticQuery(graphql`
    query EventCards {
      allEvent(sort: {time_start: DESC}) {
        events: nodes {
          title
          series
          time_start(formatString: "YYYY-MM-DD")
          image {
            path {
              childImageSharp {
                gatsbyImageData(
                  width: 600,
                  quality: 100,
                  placeholder: NONE,
                )
              }
            }
            alt
          }
          slug
        }
      }
    }
  `)
  const events = data.allEvent.events
  // If includeSeries is defined, only include those series,
  // otherwise if excludeSeries is defined, exclude those series,
  // otherwise include all events
  const filteredEvents: Event[] = []
  if (includeSeries) {
    includeSeries = includeSeries.map((series) => series.toLowerCase())
    for (const event_ of events) {
      if (includeSeries.includes(event_.series.toLowerCase())) {
        filteredEvents.push(event_)
      }
    }
  } else if (excludeSeries) {
    excludeSeries = excludeSeries.map((series) => series.toLowerCase())
    for (const event_ of events) {
      if (!excludeSeries.includes(event_.series.toLowerCase())) {
        filteredEvents.push(event_)
      }
    }
  } else {
    filteredEvents.push(...events)
  }
  return (
    <>
      <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-8">
        {filteredEvents.map((event_: Event) => (
          <Link to={event_.slug} className="use-color-text">
            <div className="card h-100">
              <div className="aspect-video flex align-middle">
                <div className="m-auto p-4">
                  <GatsbyImage
                    image={event_.image.path.childImageSharp?.gatsbyImageData as IGatsbyImageData}
                    alt={event_.image.alt}
                  />
                </div>
              </div>
              <div className="p-2">
                <div className="card-line-clamp">
                  <p className="font-mono font-size-small m-0">
                    {event_.time_start}
                  </p>
                  <p className="card-text">{event_.title}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

export default EventCards