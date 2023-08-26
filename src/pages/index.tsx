import React from "react";
import { Link, graphql } from "gatsby";
import { motion } from "framer-motion";
import { StaticImage } from "gatsby-plugin-image";

import Seo from "../components/Seo";
import { CardRow, createCard } from "../components/Card";
import { ChevronCircleRightRegular, ChevronRightRegular } from "../components/Icons/fluentui";

interface Props {
  data: Queries.IndexPageQuery;
}

export const Head = () => {
  return (
    <Seo
      title="Home"
    />
  );
};

const IndexPage = ({ data }: Props) => {
  const meeting_cards = data.allMeeting.nodes.map((meeting) =>
    createCard({meeting, timezone: meeting.timezone} as CardMeetingProps)
  );
  const event_cards = data.allEvent.nodes.map((event) =>
    createCard({event, timezone: event.timezone} as CardEventProps)
  );
  const publication_cards = data.allPublication.nodes.map((p) =>
    createCard({publication: p} as CardPublicationProps)
  );
  return (
    <>
      <section id="welcome" className="pb-8">
        <div className="flex flex-col">
          <div className="lg:order-2 pb-6 lg:w-2/3 lg:p-0 xl:w-1/2 mx-auto text-center">
            <h1 className="lg:text-6xl">Hacking @ UIUC</h1>
            <p>{data.site?.siteMetadata.description}</p>
            <Link to="/about/" className="btn-primary">Learn more</Link>
          </div>
          <div className="flex lg:order-1 gap-8 pr-20 sm:columns-2 sm:p-0 md:pr-20 lg:columns-3 lg:gap-12 lg:p-0 lg:pb-2 xl:gap-16 2xl:gap-16 2xl:px-28">
            <div className="pt-6 w-full">
              <StaticImage className="rounded-xl pointer-events-none select-none border-surface-100 border-2" src="../images/home-promo/home-1.jpg" alt="SIGPwny members concentrated on solving challenges during a CTF" placeholder="blurred" />
            </div>
            <div className="pt-0 w-full hidden sm:block">
              <StaticImage className="rounded-xl pointer-events-none select-none border-surface-100 border-2" src="../images/home-promo/home-2.jpg" alt="Two SIGPwny members taking a pizza break during Fall CTF 2023" placeholder="blurred" />
            </div>
            <div className="pt-12 w-full hidden lg:block">
              <StaticImage className="rounded-xl pointer-events-none select-none border-surface-100 border-2" src="../images/home-promo/home-3.jpg" alt="SIGPwny helpers present on web hacking during a weekly meting" placeholder="blurred" />
            </div>
          </div>
          <div className="flex lg:order-3 gap-8 pl-20 pb-2 sm:columns-2 sm:p-0 md:pl-20 lg:columns-3 lg:gap-12 lg:p-0 xl:gap-16 2xl:gap-16 2xl:px-28">
            <div className="pt-0 w-full hidden lg:block">
              <StaticImage className="rounded-xl pointer-events-none select-none border-surface-100 border-2" src="../images/home-promo/home-4.jpg" alt="A presentation on reverse engineering during Fall CTF 2023" placeholder="blurred" />
            </div>
            <div className="pt-12 w-full hidden sm:block">
              <StaticImage className="rounded-xl pointer-events-none select-none border-surface-100 border-2" src="../images/home-promo/home-5.jpg" alt="SIGPwny members laughing in front of grafitti during a spray paint social event" placeholder="blurred" />
            </div>
            <div className="pt-6 w-full">
              <StaticImage className="rounded-xl pointer-events-none select-none border-surface-100 border-2" src="../images/home-promo/home-6.jpg" alt="Two SIGPwny members solving Fall CTF 2023 challenges" placeholder="blurred" />
            </div>
          </div>
        </div>
      </section>

      <section id="meetings" className="pb-8">
        <div className="flex flex-col sm:flex-row gap-1 justify-between mb-3">
          <h1 className="m-0">
            Meetings
          </h1>
          <Link to="/meetings/" className="self-start button !text-white bg-surface-100 hover:bg-surface-150">
            <span>
              View all
            </span>
            <ChevronRightRegular className="flex-none" />
          </Link>
        </div>
        <CardRow cards={meeting_cards} />
      </section>

      <section id="publications" className="pb-8">
        <div className="flex flex-col sm:flex-row gap-1 justify-between mb-3">
          <h1 className="m-0">
            Publications
          </h1>
          <Link to="/publications/" className="self-start button !text-white bg-surface-100 hover:bg-surface-150">
            <span>
              View all
            </span>
            <ChevronRightRegular className="flex-none" />
          </Link>
        </div>
        <CardRow cards={publication_cards} />
      </section>

      <section id="events" className="pb-8">
        <div className="flex flex-col sm:flex-row gap-1 justify-between mb-3">
          <h1 className="m-0">
            Events
          </h1>
          <Link to="/events/" className="self-start button !text-white bg-surface-100 hover:bg-surface-150">
            <span>
              View all
            </span>
            <ChevronRightRegular className="flex-none" />
          </Link>
        </div>
        <CardRow cards={event_cards} />
      </section>
    </>
  );
};

export default IndexPage;

export const query = graphql`
  query IndexPage {
    site {
      siteMetadata {
        description
        timezone
      }
    }
    allMeeting(
      filter: {featured: {eq: true}}
      sort: {time_start: DESC}
      limit: 10
    ) {
      nodes {
        title
        time_start
        time_close
        timezone
        week_number
        image {
          path {
            childImageSharp {
              gatsbyImageData(width: 600, placeholder: BLURRED)
            }
          }
          alt
        }
        semester
        slug
      }
    }
    allEvent(
      sort: {time_start: DESC}
      limit: 10
    ) {
      nodes {
        title
        time_start
        time_close
        timezone
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
    allPublication(
      sort: {date: DESC}
      limit: 10
    ) {
      nodes {
        title
        credit
        publication_type
        publisher
        date
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
`;