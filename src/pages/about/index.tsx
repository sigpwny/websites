import React from "react"
import { Link, graphql } from "gatsby"
import { motion } from "framer-motion"
import { StaticImage, IGatsbyImageData } from "gatsby-plugin-image"

import Seo from "../../components/Seo"
import AdminProfiles from "../../components/Profiles/Admins"
import AlumProfiles from "../../components/Profiles/Alumni"
import HelperProfiles from "../../components/Profiles/Helpers"
import Timeline, { type Event } from "../../components/Timeline"

import "./about.css"

export function Head() {
  return (
    <Seo
      title="About"
      description="Learn about who SIGPwny is and our mission"
    />
  )
}

const events : Array<Event> = [
  {
    title: "SIGMil was founded",
    description: "SIGMil was founded as a student-run group focused on security and hacking.",
    date: "2002",
    link: {
      "href": "https://web.archive.org/web/20100619112420/http://www.acm.uiuc.edu/sigmil/index.php",
      "text": "Check out the homepage"
    }
  },
  {
    title: "SIGMil was rebranded as SIGPony",
    description: "The change away from SIG Military/Militant represented a shift towards learning-focused hacking.",
    date: "2011",
    link: {
      "href": "https://github.com/acm-uiuc/pony-site",
      "text": "Check out the website source"
    }
  },
  {
    title: "SIGPony was rebranded as SIGPwny",
    description: "The change was made since 'pwn' is a more common term in the hacking community.",
    date: "2012",
  },
  {
    title: "First UIUCTF was held",
    description: "UIUCTF is an annual CTF competition hosted by SIGPwny.",
    date: "April 2015",
    link: {
      href: "https://ctftime.org/event/192",
      text: "CTFTime event page"
    }
  },
  {
    title: "Club and meeting philosophy created",
    description: "Ian becomes president, creating a club philosophy of inclusivity and hands-on learning (15 minute lectures).",
    date: "August 2018"
  },
  {
    title: "First Fall CTF",
    description: "SIGPwny runs its first recruiting event to get new members interested in the club.",
    date: "September 2019",
    link: {
      href: "https://beta.sigpwny.com/publications/2022-05-17_running-sigpwnys-first-recruiting-ctf/",
      text: "Dillon's blog post"
    }
  },
  {
    title: "SIGPwny presents at DEFCON",
    description: "Ravi (previous president) and Minh present at DEFCON 30 with a bunch of SIGPwny members flying out to Vegas.",
    date: "August 2022",
    link: {
      href: "https://media.defcon.org/DEF%20CON%2030/DEF%20CON%2030%20presentations/",
      text: "DEFCON 30 presentations"
    }
  },
  {
    title: "Fall CTF 2022",
    description: "SIGPwny runs its largest recruiting event yet, with 200+ participants, shirts and sponsor booths.",
    date: "September 2022",
    link: {
      href: "https://beta.sigpwny.com/events/fallctf/2022/",
      text: "Fall CTF 2022"
    }   
  },
  {
    title: "Top 50 on CTFTime",
    description: "After 6 years of competing, SIGPwny finally reaches a first-page ranking on CTFTime.",
    date: "December 2022",
    link: {
      href: "https://ctftime.org/team/27763",
      text: "CTFTime team page"
    }
  },
  {
    title: "Cyphercon 2023",
    description: "SIGPwny attends Cyphercon for the second year in Milwaukee, WI, bringing 20+ members.",
    date: "April 2023",
    link: {
      href: "https://cyphercon.com/",
      text: "Cyphercon"
    }
  },
  {
    title: "eCTF 2023",
    description: "SIGPwny competes in eCTF 2023, placing third and attending the awards ceremony in DC.",
    date: "April 2023",
    link: {
      href: "https://ectf.mitre.org/",
      text: "eCTF homepage"
    }
  },
]
const AboutPage = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between">
      <div className="flex flex-col gap-8">
        <section id="acronym" className="py-8">
          <div className="flex flex-col">
            <div className="flex flex-row justify-center pb-6">
              <div className="flex flex-col slide-in-from-right">
                <p className="use-color-primary font-bold text-right text-5xl sm:text-6xl md:text-7xl lg:text-8xl">SIG</p>
                <p className="text-center">&#8595;</p>
                <p className="font-bold text-center">Special <br />Interest <br />Group</p>
              </div>
              <div className="flex flex-col">
                <p className="use-color-primary font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl">&nbsp;&bull;&nbsp;Pwn&nbsp;&bull;&nbsp;</p>
                <p className="text-center">&#8595;</p>
                <p className="font-bold text-center">To hack <br />or "own" <br />(slang)</p>
              </div>
              <div className="flex flex-col slide-in-from-left">
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
        <section id="what-we-do">
          <div className="text-center">
            <div className="panel mx-auto max-w-prose">
              <p className="font-bold text-4xl">
                What do we do?
              </p>
              <p className="m-0">
                As the cybersecurity club at the University of Illinois Urbana-Champaign, our mission is to 
                teach students cybersecurity through meetings, competitions, and research.
              </p>
            </div>
          </div>
        </section>
        <section id="beginner-friendly">
          <div className="text-center">
            <div className="panel mx-auto max-w-prose">
              <p className="font-bold text-4xl">
                We're beginner-friendly
              </p>
              <p className="m-0">
                We believe cybersecurity should be accessible to all, so we teach everything from the ground up. Our 
                meetings are designed to be approached by <em>anyone</em>, regardless of skill, major, or experience.
              </p>
            </div>
          </div>
        </section>
        <section id="philosophy">
          <div className="text-center">
            <div className="panel mx-auto max-w-prose">
              <p className="font-bold text-4xl">
                Our teaching philosophy
              </p>
              <p className="m-0">
                We believe that the best way to learn is by doing &ndash; so we're not going to lecture you for an hour. 
                Our meetings are typically 15 minutes of presentation followed by 45 minutes of hands-on hacking.
              </p>
              <StaticImage className="rounded-xl pointer-events-none w-1/3" src="./meeting-format-chart.png" alt="A pie chart showing the 15/45 meeting time breakdown." placeholder="blurred" />
            </div>
          </div>
        </section>
        {/* <section id="club-philosophy">
          <div className="card grid grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <div className="col-span-2 lg:col-span-2">
              <p className="font-bold text-2xl">Community</p>
              <p className="pb-4">We strive to build a community focused on teaching and inclusion by inviting beginners to run meetings, running social events, and playing CTFs together as a club.</p>
            </div>
            <div className="col-span-2 lg:col-span-1 p-4">
            </div>
          </div>
        </section> */}

        <section id="who-we-are">
          <div className="text-center">
            <div className="panel mx-auto max-w-prose">
              <p className="font-bold text-4xl">Who we are</p>
              <p className="m-0">
                SIGPwny is completely student-run and would not be able to support everyone without the contributions 
                from our admin team, helpers, and alumni.
              </p>
            </div>
          </div>
          <AdminProfiles />
          <HelperProfiles />
          <AlumProfiles />
        </section>
      </div>
      {/* <div className="flex ml-4 md:w-1/3 lg:w-1/4">
        <Timeline events={events} />
      </div> */}

    </div>
  )
}

export default AboutPage