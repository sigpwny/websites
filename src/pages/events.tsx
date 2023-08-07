import React from "react"
import { Link, graphql } from "gatsby"

import Seo from "../components/Seo"
import { CardGrid } from "../components/Card"

type Event = Queries.EventsPageQuery["allEvent"]["events"][0]

interface Props {
  data: Queries.EventsPageQuery 
}

export function Head() {
  return (
    <Seo
      title="Events"
      description="Index of all SIGPwny events"
    />
  )
}

const EventsPage = ({ data }: Props) => {
  const events = data.allEvent.events
  const events_uiuctf = events.filter(
    (event_: Event) => event_.series.toLowerCase() === "uiuctf"
  )
  const events_fallctf = events.filter(
    (event_: Event) => event_.series.toLowerCase() === "fallctf"
  )
  const cards_uiuctf = events_uiuctf.map((event_: Event) => (
    {
      card_image: event_.card_image,
      link: event_.slug,
    }
  )) as CardProps[]
  const cards_fallctf = events_fallctf.map((event_: Event) => (
    {
      card_image: event_.card_image,
      link: event_.slug,
    }
  )) as CardProps[]
  return (
    <>
      <section id="uiuctf" className="pb-8">
        <h1>UIUCTF</h1>
        <p>
          UIUCTF is SIGPwny's premier global CTF competition.
        </p>
        <CardGrid cards={cards_uiuctf} />
      </section>
      <section id="fallctf" className="pb-8">
        <h1>Fall CTF</h1>
        <p>
          Fall CTF is a beginner-friendly CTF competition for UIUC students, 
          designed to introduce students to cybersecurity topics.
        </p>
        <CardGrid cards={cards_fallctf} />
      </section>
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
        time_start(formatString: "YYYY-MM-DD")
        card_image {
          foreground {
            publicURL
          }
          background {
            publicURL
          }
          foreground_image {
            childImageSharp {
              gatsbyImageData(width: 600)
            }
          }
          background_image {
            childImageSharp {
              gatsbyImageData(width: 600, placeholder: BLURRED)
            }
          }
          background_color
          alt
        }
        slug
      }
    }
  }
`