import React from "react"
import { Link, graphql, navigate } from "gatsby"

import Layout from "../components/Layout"
import MeetingCards from "../components/MeetingCards"

export function Head() {
  return (
    <>
      <title>Hello World</title>
    </>
  )
}

const IndexPage = () => (
  <Layout>
    <h1>Hello World</h1>
    <p>
      This is a simple example of a Gatsby page.
      <br />
    </p>
    <div className="row">
      <h1>Meetings</h1>
      <MeetingCards />
    </div>
  </Layout>
)

export default IndexPage