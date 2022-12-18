import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { StaticImage, IGatsbyImageData } from "gatsby-plugin-image"

export function Head() {
  return (
    <>
      <title>Meetings</title>
    </>
  )
}

const MeetingsPage = () => {
  return (
    <>
      <section id="meetings" className="pb-8">
        <h1>Meetings</h1>
      </section>
    </>
  )
}

export default MeetingsPage