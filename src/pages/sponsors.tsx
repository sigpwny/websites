import React from "react";
import dayjs from "dayjs";
import { graphql } from "gatsby";

import Seo from "../components/Seo";
import { Card, createCard } from "../components/Card";

interface Props {
  data: Queries.SponsorsPageQuery
}

export function Head() {
  return (
    <Seo
      title="Sponsors"
      description="Thank you to our sponsors!"
    />
  );
}

const SponsorsPage = ({ data }: Props) => {
  const events = data.allEvent.nodes;
  // Filter for events that occured in the past year or in the future
  // and are the most recent event in each series
  const min_date = dayjs().subtract(1, "year");
  const uniq_series = new Set<string>();
  const recent_events = events.filter((event) => {
    if (
      dayjs(event.time_start) < min_date ||
      uniq_series.has(event.series) ||
      !event.sponsors_profiles ||
      event.sponsors_profiles.length === 0
    ) return false;
    uniq_series.add(event.series);
    return true;
  });
  // TODO: Add support for meeting sponsors
  return (
    <div className="flex flex-col gap-8 mx-auto page-width-lg">
      <span>
        <h1>Sponsors</h1>
        <p>
          Thank you to our sponsors for supporting SIGPwny!
        </p>
        <div className="flex flex-col gap-4">
          {recent_events.map((event, event_idx) => (
            <span key={event_idx}>
              <h2>{event.title}</h2>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {event.sponsors_profiles!.map((sponsor, sponsor_idx) => (
                  <div key={sponsor_idx} className="flex grow">
                    <Card {...createCard({sponsor} as CardSponsorProps)} />
                  </div>
                ))}
              </div>
            </span>
          ))}
        </div>
      </span>
      <div className="panel">
        <h2>Interested in sponsoring?</h2>
        <p>
          Please contact us at <a href="mailto:sponsors@sigpwny.com">sponsors@sigpwny.com</a>!
          Sponsors can receive a variety of benefits, from resume books to 
          recruiting events. We are happy to work with you!
        </p>
      </div>
    </div>
  );
}

export default SponsorsPage;

export const query = graphql`
  query SponsorsPage {
    allEvent(sort: {time_start: DESC}) {
      nodes {
        title
        series
        time_start
        sponsors_profiles {
          name
          profile_image {
            childImageSharp {
              gatsbyImageData(width: 160, aspectRatio: 1)
            }
          }
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
          affiliation
          handle
          bio
          role
          weight
          links {
            name
            url
          }
        }
        slug
      }
    }
  }
`;