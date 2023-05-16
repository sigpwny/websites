import React from "react"
import { graphql } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
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
    throw new Error(`invalid argument: "event_" is null`)
  }
  return (
    <Seo
      title={event_.title}
      description={event_.description}
      image={event_.image && event_.image.path ? (
        event_.image.path.childImageSharp?.gatsbyImageData.images.fallback?.src
      ) : undefined}
    />
  )
}

const EventTemplate = ({ data, children }: Props) => {
  if (!data.event_) {
    throw new Error(`invalid argument: "event_" is null`)
  }
  return (
    <>
      <div className="flex lg:flex-row flex-col gap-4">
        <aside className="xl:w-96 lg:w-80">
          <div className="sticky top-4">
            <Card
              // heading={data.event_.time_start}
              // title={data.event_.title}
              image={data.event_.image as Image}
              overlay_image={data.event_.overlay_image as Image}
            />
            <div className="panel mt-4">
              <h1>{data.event_.title}</h1>
              {(data.event_.start_date || data.event_.close_date) && (
                <div className="flex flex-row mb-2">
                  {data.event_.start_date && (
                    <div className="flex-1 flex-col">
                      <p className="m-0 font-bold">Time Start</p>
                      <p className="m-0 text-xl">{data.event_.start_date}</p>
                      <p className="m-0">{data.event_.start_hour}</p>
                    </div>
                  )}
                  {data.event_.close_date && (
                    <div className="flex-1 flex-col">
                      <p className="m-0 font-bold">Time End</p>
                      <p className="m-0 text-xl">{data.event_.close_date}</p>
                      <p className="m-0">{data.event_.close_hour}</p>
                    </div>
                  )}
                </div>
              )}
              {data.event_.location && (
                <div className="mb-2">
                  <LocationSvg />
                  <p className="inline align-middle m-0 ml-2">
                    {data.event_.location}
                  </p>
                </div>
              )}
              {data.event_.links && (
                <ul>
                  {data.event_.links.website && (
                    <li>
                      <a
                        href={data.event_.links.website}
                        target="_blank" rel="noopener noreferrer"
                      >
                        Event Site
                      </a>
                    </li>
                  )}
                  {data.event_.links.ctftime && (
                    <li>
                      <a
                        href={data.event_.links.ctftime}
                        target="_blank" rel="noopener noreferrer"
                      >
                        CTFtime
                      </a>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </aside>

        <div className="w-100 grow">
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
    </>
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
      image {
        path {
          childImageSharp {
            gatsbyImageData(
              width: 1024,
              quality: 100,
              placeholder: NONE,
            )
          }
        }
        alt
      }
      overlay_image {
        path {
          childImageSharp {
            gatsbyImageData(
              width: 1024,
              quality: 100,
              placeholder: NONE,
            )
          }
        }
        alt
      }
      links {
        website
        ctftime
      }
      rating_weight
      stats {
        name
        value
      }
    }
  }
`