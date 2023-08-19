import React from "react";
import { graphql } from "gatsby";

import Seo from "../components/Seo";
import { Card, createCard } from "../components/Card";
import { MDXProvider } from "../components/MDXProvider";
import { LocationSvg } from "../components/Icons";
import { convertDate } from "../utils/util";

interface Props {
  data: Queries.EventTemplateQuery
  children: React.ReactNode
}

export const Head = ({ data }: Props) => {
  const { event } = data;
  if (!event) {
    throw new Error(`invalid argument: "event" is undefined`);
  }
  const meta_image = 
    event.card_image.foreground?.publicURL ??
    event.card_image.background?.publicURL ??
    undefined;
  return (
    <Seo
      title={event.title}
      description={event.description}
      image={meta_image}
    />
  )
}

const getLinkName = (name: string) => {
  if (name === 'ctftime') return 'CTFtime';
  if (name === 'website') return 'Event Site';
  return name
}

const EventTemplate = ({ data, children }: Props) => {
  if (!data.event) {
    throw new Error(`invalid argument: "event" is undefined`);
  }
  const event = data.event;
  const sponsor_cards = event.sponsors_profiles?.map((sponsor) =>
    createCard({sponsor} as CardSponsorProps));
  return (
    <div className="flex lg:flex-row flex-col gap-4">
      <aside className="flex shrink-0 xl:w-96 lg:w-80">
        <div className="block">
          <div className="flex flex-col gap-4 sticky top-4">
            <Card card_image={event.card_image as CardImageProps} />
            <div className="panel">
              <h1>{event.title}</h1>
              {(event.time_start || event.time_close) && (
                <div className="flex flex-row mb-2">
                  {event.time_start && (
                    <div className="flex-1 flex-col">
                      <p className="m-0 font-bold">Time Start</p>
                      <p className="m-0 text-xl">
                        {convertDate(event.time_start, "MMM DD, YYYY", event.timezone)}
                      </p>
                      <p className="m-0">
                        {convertDate(event.time_start, "h:mm A z", event.timezone)}
                      </p>
                    </div>
                  )}
                  {event.time_close && (
                    <div className="flex-1 flex-col">
                      <p className="m-0 font-bold">Time End</p>
                      <p className="m-0 text-xl">
                        {convertDate(event.time_close, "MMM DD, YYYY", event.timezone)}
                      </p>
                      <p className="m-0">
                        {convertDate(event.time_close, "h:mm A z", event.timezone)}
                      </p>
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
                  {event.links.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link.url}
                        target="_blank" rel="noopener noreferrer"
                      >
                        {getLinkName(link.name)}
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
          {data.event.description ? (
            <section id="description" className="panel">
              <h2>Event Description</h2>
              <p>{data.event.description}</p>
            </section>
          ) : null}
          {data.event.stats ? (
            <section id="stats" className="panel">
              <h2>Event Statistics</h2>
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2">
                {data.event.stats.map((stat, i) => (
                  <div key={i} className="mb-2">
                    <p className="m-0 font-bold">{stat?.name}</p>
                    <p className="m-0 font-mono text-4xl">{stat?.value}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          {sponsor_cards ? (
            <>
              <section id="sponsors" className="panel">
                <h2>Sponsors</h2>
                <p>
                  This event would not be possible without the support of our sponsors!
                </p>
              </section>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
                {sponsor_cards.map((card, idx) => (
                  <div key={idx} className="flex grow">
                    <Card {...card} />
                  </div>
                ))}
              </div>
            </>
          ) : null}
          <section id="content" className="panel overflow-hidden">
            <MDXProvider>
              <div className="md-root">
                {children}
              </div>
            </MDXProvider>
          </section>
        </div>
      </div>
    </div>
  );
}

export default EventTemplate;

export const query = graphql`
  query EventTemplate($id: String!) {
    event: event(id: { eq: $id }) {
      title
      description
      time_start
      time_close
      timezone
      credit
      credit_profiles {
        name
        profile_image {
          childImageSharp {
            gatsbyImageData(width: 160, aspectRatio: 1)
          }
        }
        handle
        links {
          name
          url
        }
        role
      }
      sponsors
      sponsors_profiles {
        name
        card_image {
          foreground {
            publicURL
          }
          background {
            publicURL
          }
          foreground_image {
            childImageSharp {
              gatsbyImageData(width: 1024)
            }
          }
          background_image {
            childImageSharp {
              gatsbyImageData(width: 1024, placeholder: BLURRED)
            }
          }
          background_color
          alt
        }
        profile_image {
          childImageSharp {
            gatsbyImageData(width: 160, aspectRatio: 1)
          }
        }
        handle
        links {
          name
          url
        }
        role
      }
      location
      card_image {
        foreground {
          publicURL
        }
        background {
          publicURL
        }
        foreground_image {
          childImageSharp {
            gatsbyImageData(width: 1024)
          }
        }
        background_image {
          childImageSharp {
            gatsbyImageData(width: 1024, placeholder: BLURRED)
          }
        }
        background_color
        alt
      }
      links {
        name
        url
      }
      stats {
        name
        value
      }
    }
  }
`;