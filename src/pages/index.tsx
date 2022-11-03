import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"

import Layout from "../components/Layout"
import MeetingCards from "../components/MeetingCards"

export function Head() {
  return (
    <>
      <title>Home</title>
    </>
  )
}

// graphql query to get description
const descriptionQuery = graphql`
  query {
    site {
      siteMetadata {
        description
      }
    }
  }
`

const IndexPage = () => (
  <Layout>
    <div className="panel mb-6">
      <h1>We are SIGPwny</h1>
      <p>{useStaticQuery(descriptionQuery).site.siteMetadata.description}</p>
    </div>
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
  </Layout>
)

export default IndexPage