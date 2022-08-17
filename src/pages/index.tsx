import React from "react"
import { Link, graphql, navigate } from "gatsby"

import Layout from "../components/Layout"
import MeetingCards from "../components/MeetingCards"

export function Head() {
  return (
    <>
      <title>Home</title>
    </>
  )
}

const IndexPage = () => (
  <Layout>
    <h1>Hello World</h1>
    <p>
      This is the start of the new SIGPwny website.
      <br />
    </p>
    <h1>Meetings</h1>
    <MeetingCards />
  </Layout>
)

export default IndexPage