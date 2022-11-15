import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { StaticImage, IGatsbyImageData } from "gatsby-plugin-image"

import Layout from "../components/Layout"
// import ProfileBig from "../components/ProfileBig"

export function Head() {
  return (
    <>
      <title>About</title>
    </>
  )
}

interface ProfileBigType {
  name: string
  bio: string
  image: {
    path: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
    }
    alt: string
  }
  handle?: string
  role?: string
  weight: number
  links?: {
    email?: string
    website?: string
    github?: string
    twitter?: string
    linkedin?: string
    discord?: string
  }
}

interface Profile {
  fileAbsolutePath: string
  parent: {
    sourceInstanceName: string
  }
  frontmatter: ProfileBigType
}

interface AboutQuery {
  allProfiles: {
    profiles: Profile[]
  }
}

const AboutPage = () => (
  <Layout>
    <section id="acronym" className="py-8">
      <div className="flex flex-col">
        <div className="flex flex-row justify-center pb-6">
          <div className="flex flex-col">
            <p className="use-color-primary font-bold text-right text-5xl sm:text-6xl md:text-7xl lg:text-8xl">SIG</p>
            <p className="text-center">&#8595;</p>
            <p className="font-bold text-center">Special <br />Interest <br />Group</p>
          </div>
          <div className="flex flex-col">
            <p className="use-color-primary font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl">&nbsp;&bull;&nbsp;Pwn&nbsp;&bull;&nbsp;</p>
            <p className="text-center">&#8595;</p>
            <p className="font-bold text-center">To hack <br />or "own" <br />(slang)</p>
          </div>
          <div className="flex flex-col">
            <p className="use-color-primary font-bold text-left text-5xl sm:text-6xl md:text-7xl lg:text-8xl">y</p>
            <p className="text-center">&#8595;</p>
            <p className="font-bold text-center">For <br />cool <br />logo</p>
          </div>
        </div>
        <div className="flex flex-row justify-center">
          <p>sig-<b>poh</b>-nee</p>
          <p>&nbsp;<small>[audio]</small></p>
        </div>
      </div>
    </section>

    <section id="text-info" className="pb-8">
      <h1>What We Do</h1>
      <h1>What We Don't Do</h1>
    </section>

    <section id="text-info" className="pb-8">
      <h1>Our Values</h1>
      <ul>
        <li>Education</li>
        <li>Inclusion</li>
        <li>Competition (Collaboration)</li>
      </ul>
    </section>

    {/* <section id="opportunities" className="pb-8">
      <h1>Opportunities</h1>
      <h2>Research</h2>
      <h2>CTF Events</h2>
      <h2>Helper Team</h2>
    </section> */}

    <section id="admins" className="pb-8">
      <h1>Admin Team</h1>
      <div className="flex flex-col">
      </div>
    </section>

    <section id="helpers" className="pb-8">
      <h1>Helper Team</h1>
    </section>

    <section id="alumni" className="pb-8">
      <h1>Alumni</h1>
    </section>
  </Layout>
)

export default AboutPage