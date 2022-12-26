import React from "react"
import { graphql } from "gatsby"

import EventCards from "../components/EventCards"

interface Props {
  data: Queries.EventsPageQuery
}

const EventsPage = ({ data }: Props) => {
  const events = data.allEvent.events
  return (
    <>
      <h1>Events</h1>
      <EventCards includeSeries={["uiuctf"]} />
    </>
  )
}

export default EventsPage

export const query = graphql`
  query EventsPage {
    allEvent(sort: {time_start: DESC}) {
      events: nodes {
        title
        series
        time_start
        image {
          path {
            childImageSharp {
              gatsbyImageData(width: 500, quality: 100)
            }
          }
          alt
        }
        slug
      }
    }
  }
`