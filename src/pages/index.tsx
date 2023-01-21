import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import MeetingCards from "../components/MeetingCards"
import Seo from "../components/Seo"

interface Props {
  data: Queries.IndexPageQuery
}

export function Head() {
  return (
    <Seo
      title="Home"
    />
  )
}

const IndexPage = ({ data }: Props) => (
  <>
    <section id="welcome" className="pb-8">
      <div className="flex flex-col">
        <div className="lg:order-2 pb-6 lg:w-2/3 lg:p-0 xl:w-1/2 mx-auto text-center">
          <h1 className="lg:text-6xl">Hacking @ UIUC</h1>
          <p>{data.site?.siteMetadata.description}</p>
          <Link className="btn-primary" to="/about/">Learn more</Link>
        </div>
        <div className="flex lg:order-1 gap-8 pr-20 sm:columns-2 sm:p-0 md:pr-20 lg:columns-3 lg:gap-16 lg:p-0 lg:pb-2 xl:gap-24 2xl:gap-28 2xl:px-28">
          <div className="pt-6">
            <StaticImage className="rounded-xl" src="../images/placeholder.png" alt="Placeholder A1" placeholder="blurred" />
          </div>
          <div className="pt-0 hidden sm:block">
            <StaticImage className="rounded-xl" src="../images/placeholder.png" alt="Placeholder A2" placeholder="blurred" />
          </div>
          <div className="pt-12 hidden lg:block">
            <StaticImage className="rounded-xl" src="../images/placeholder.png" alt="Placeholder A3" placeholder="blurred" />
          </div>
        </div>
        <div className="flex lg:order-3 gap-8 pl-20 pb-2 sm:columns-2 sm:p-0 md:pl-20 lg:columns-3 lg:gap-16 lg:p-0 xl:gap-24 2xl:gap-28 2xl:px-28">
          <div className="pt-0 hidden lg:block">
            <StaticImage className="rounded-xl" src="../images/placeholder.png" alt="Placeholder B1" placeholder="blurred" />
          </div>
          <div className="pt-12 hidden sm:block">
            <StaticImage className="rounded-xl" src="../images/placeholder.png" alt="Placeholder B2" placeholder="blurred" />
          </div>
          <div className="pt-6">
            <StaticImage className="rounded-xl" src="../images/placeholder.png" alt="Placeholder B3" />
          </div>
        </div>
      </div>
    </section>

    <section id="meetings">
      <h1>Meetings</h1>
      <MeetingCards />
    </section>
    <section id="meetings">
      <h1>Publications</h1>
      <div className="panel mb-6">
        <p>TODO</p>
      </div>
    </section>
    <section id="events">
      <h1>Events</h1>
      <div className="panel mb-6">
        <p>TODO</p>
      </div>
    </section>
  </>
)

export default IndexPage

export const query = graphql`
  query IndexPage {
    site {
      siteMetadata {
        description
      }
    }
  }
`
