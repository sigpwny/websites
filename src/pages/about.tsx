import React from "react"
import { Link, graphql } from "gatsby"
import { StaticImage, IGatsbyImageData } from "gatsby-plugin-image"

import Seo from "../components/Seo"
import AdminProfiles from "../components/Profiles/Admins"
import AlumProfiles from "../components/Profiles/Alumni"
import HelperProfiles from "../components/Profiles/Helpers"

export function Head() {
  return (
    <Seo
      title="About"
      description="Learn about who SIGPwny is and our mission"
    />
  )
}

const AboutPage = () => {
  return (
    <>
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
        <div className="panel">
          <ul>
            <li>Education</li>
            <li>Inclusion</li>
            <li>Competition (Collaboration)</li>
          </ul>
        </div>
      </section>

      {/* <section id="opportunities" className="pb-8">
        <h1>Opportunities</h1>
        <h2>Research</h2>
        <h2>CTF Events</h2>
        <h2>Helper Team</h2>
      </section> */}

      <AdminProfiles />
      <HelperProfiles />
      <AlumProfiles />

    </>
  )
}

export default AboutPage