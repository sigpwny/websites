import React from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"

import Seo from "../components/Seo"
import Card from "../components/Card"
import { LocationSvg } from "../components/Icons"

interface Props {
  data: Queries.EventTemplateQuery
  children: React.ReactNode
}

export const Head = ({ data }: Props) => {
  const { event_ } = data
  if (!event_) {
    throw new Error(`invalid argument: "event_" is undefined`)
  }
  return (
    <Seo
      title={event_.title}
      description={event_.description}
      image={event_.background_image?.path?.childImageSharp?.gatsbyImageData.images.fallback?.src}
    />
  )
}

const getLinkName = (name: string) => {
  if (name === 'ctftime') return 'CTFtime'
  if (name === 'website') return 'Event Site'
  return name
}

const EventTemplate = ({ data, children }: Props) => {
  if (!data.event_) {
    throw new Error(`invalid argument: "event_" is undefined`)
  }

  const event = data.event_

  return (
    <div className="flex lg:flex-row flex-col gap-4">
      <aside className="flex shrink-0 xl:w-96 lg:w-80">
        <div className="block">
          <div className="flex flex-col gap-4 sticky top-4">
            <Card
              image={event.background_image as Image}
              overlay_image={event.overlay_image as Image}
            />
            <div className="panel">
              <h1>{event.title}</h1>
              {(event.start_date || event.close_date) && (
                <div className="flex flex-row mb-2">
                  {event.start_date && (
                    <div className="flex-1 flex-col">
                      <p className="m-0 font-bold">Time Start</p>
                      <p className="m-0 text-xl">{event.start_date}</p>
                      <p className="m-0">{event.start_hour}</p>
                    </div>
                  )}
                  {event.close_date && (
                    <div className="flex-1 flex-col">
                      <p className="m-0 font-bold">Time End</p>
                      <p className="m-0 text-xl">{event.close_date}</p>
                      <p className="m-0">{event.close_hour}</p>
                    </div>
                  )}
                </div>
              )}
              {event.location && (
                <div className="mb-2">
                  <LocationSvg />
                  <p className="inline align-middle m-0 ml-2">
                    {event.location}
                  </p>
                </div>
              )}
              {event.links && (
                <ul>
                  {event.links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link?.link}
                        target="_blank" rel="noopener noreferrer"
                      >
                        {getLinkName(link?.name || '')}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <div className="grid gap-4">
          {data.event_.description && (
            <section id="description" className="panel">
              <h2>Event Description</h2>
              <p>{data.event_.description}</p>
            </section>
          )}
          {data.event_.stats && (
            <section id="stats" className="panel">
              <h2>Event Statistics</h2>
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2">
                {data.event_.stats.map((stat, i) => (
                  <div key={i} className="mb-2">
                    <p className="m-0 font-bold">{stat?.name}</p>
                    <p className="m-0 font-mono text-4xl">{stat?.value}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section id="content" className="panel">
            <MDXProvider>
              <div className="md-root">
                {children}
              </div>
            </MDXProvider>
          </section>
        </div>
      </div>
    </div>
  )
}

export default EventTemplate

export const query = graphql`
  query EventTemplate($id: String!) {
    event_: event(id: { eq: $id }) {
      title
      description
      start_date: time_start(formatString: "MMM DD, YYYY")
      start_hour: time_start(formatString: "HH:mm z")
      close_date: time_close(formatString: "MMM DD, YYYY")
      close_hour: time_close(formatString: "HH:mm z")
      location
      overlay_image {
        path {
          childImageSharp {
            gatsbyImageData(width: 1024)
          }
        }
        alt
      }
      background_image {
        path {
          childImageSharp {
            gatsbyImageData(width: 1024, placeholder: BLURRED)
          }
        }
        alt
      }
      links {
        name
        link
      }
      stats {
        name
        value
      }
    }
  }
`