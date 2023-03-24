import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Seo from "../components/Seo"
import CardRow from "../components/CardRow"
import { weekNumber, convertDate } from "../utils/util"

interface Props {
  data: Queries.IndexPageQuery
}

type Meeting = Queries.IndexPageQuery["allMeeting"]["meetings"][0]
type Event = Queries.IndexPageQuery["allEvent"]["events"][0]
type Publication = Queries.IndexPageQuery["allPublication"]["publications"][0]

export function Head() {
  return (
    <Seo
      title="Home"
    />
  )
}

const IndexPage = ({ data }: Props) => {
  const meeting_cards = data.allMeeting.meetings.map((meeting: Meeting) => ({
    heading: meeting.semester + " Week " + weekNumber(meeting.week_number) + " • " + convertDate(meeting.time_start, "YYYY-MM-DD", data.site!.siteMetadata.timezone),
    title: meeting.title,
    image: meeting.image as Image,
    link: meeting.slug!
  }))
  const event_cards = data.allEvent.events.map((event: Event) => ({
    heading: convertDate(event.time_start, "YYYY-MM-DD", data.site!.siteMetadata.timezone),
    title: event.title,
    image: event.image as Image,
    link: event.slug!
  }))
  const publication_cards = data.allPublication.publications.map((publication: Publication) => ({
    heading: publication.publication_type.toUpperCase() + " • " + publication.publisher,
    title: publication.title,
    image: publication.image as Image,
    link: publication.slug!
  }))
  return (
    <>
      <section id="welcome" className="pb-8">
        <div className="flex flex-col">
          <div className="lg:order-2 pb-6 lg:w-2/3 lg:p-0 xl:w-1/2 mx-auto text-center">
            <h1 className="lg:text-6xl">Hacking @ UIUC</h1>
            <p>{data.site?.siteMetadata.description}</p>
            <Link className="btn-primary" to="/about/">Learn more</Link>
          </div>
          <div className="flex lg:order-1 gap-8 pr-20 sm:columns-2 sm:p-0 md:pr-20 lg:columns-3 lg:gap-12 lg:p-0 lg:pb-2 xl:gap-16 2xl:gap-16 2xl:px-28">
            <div className="pt-6 w-full">
              <StaticImage className="rounded-xl pointer-events-none" src="../images/home-promo/home-1.jpg" alt="SIGPwny members concentrated on solving challenges during a CTF" placeholder="blurred" />
            </div>
            <div className="pt-0 w-full hidden sm:block">
              <StaticImage className="rounded-xl pointer-events-none" src="../images/home-promo/home-2.jpg" alt="Two SIGPwny members taking a pizza break during Fall CTF 2023" placeholder="blurred" />
            </div>
            <div className="pt-12 w-full hidden lg:block">
              <StaticImage className="rounded-xl pointer-events-none" src="../images/home-promo/home-3.jpg" alt="SIGPwny helpers present on web hacking during a weekly meting" placeholder="blurred" />
            </div>
          </div>
          <div className="flex lg:order-3 gap-8 pl-20 pb-2 sm:columns-2 sm:p-0 md:pl-20 lg:columns-3 lg:gap-12 lg:p-0 xl:gap-16 2xl:gap-16 2xl:px-28">
            <div className="pt-0 w-full hidden lg:block">
              <StaticImage className="rounded-xl pointer-events-none" src="../images/home-promo/home-4.jpg" alt="A presentation on reverse engineering during Fall CTF 2023" placeholder="blurred" />
            </div>
            <div className="pt-12 w-full hidden sm:block">
              <StaticImage className="rounded-xl pointer-events-none" src="../images/home-promo/home-5.jpg" alt="SIGPwny members laughing in front of grafitti during a spray paint social event" placeholder="blurred" />
            </div>
            <div className="pt-6 w-full">
              <StaticImage className="rounded-xl pointer-events-none" src="../images/home-promo/home-6.jpg" alt="Two SIGPwny members solving Fall CTF 2023 challenges" placeholder="blurred" />
            </div>
          </div>
        </div>
      </section>

      <section id="meetings" className="pb-8">
        <div className="flex flex-col sm:flex-row justify-between mb-4">
          <h1 className="m-0">Meetings</h1>
          <Link to="/meetings/" className="my-0 sm:self-end">View all &#10132;</Link>
        </div>
        <CardRow cards={meeting_cards} />
      </section>

      <section id="publications" className="pb-8">
        <div className="flex flex-col sm:flex-row justify-between mb-4">
          <h1 className="m-0">Publications</h1>
          <Link to="/publications/" className="my-0 sm:self-end">View all &#10132;</Link>
        </div>
        <CardRow cards={publication_cards} />
      </section>

      <section id="events" className="pb-8">
        <div className="flex flex-col sm:flex-row justify-between mb-4">
          <h1 className="m-0">Events</h1>
          <Link to="/events/" className="my-0 sm:self-end">View all &#10132;</Link>
        </div>
        <CardRow cards={event_cards} />
      </section>
    </>
  )
}

export default IndexPage

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
      meetings: nodes {
        title
        time_start
        time_close
        week_number
        image {
          path {
            childImageSharp {
              gatsbyImageData(width: 600, quality: 100)
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
      events: nodes {
        title
        time_start
        time_close
        image {
          path {
            childImageSharp {
              gatsbyImageData(width: 600, quality: 100)
            }
          }
          alt
        }
        slug
      }
    }
    allPublication(
      sort: {time_start: DESC}
      limit: 10
    ) {
      publications: nodes {
        title
        credit
        publication_type
        publisher
        time_start
        image {
          path {
            childImageSharp {
              gatsbyImageData(width: 600, quality: 100)
            }
          }
          alt
        }
        slug
      }
    }
  }
`
