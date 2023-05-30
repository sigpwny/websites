import React from "react"
import { Link, graphql } from "gatsby"
import { StaticImage, IGatsbyImageData } from "gatsby-plugin-image"

import Seo from "../components/Seo"
import AdminProfiles from "../components/Profiles/Admins"
import AlumProfiles from "../components/Profiles/Alumni"
import HelperProfiles from "../components/Profiles/Helpers"
import Timeline, { type Event } from "../components/Timeline"

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
      <div className="flex flex-col md:grow">
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
        <AdminProfiles />
        <HelperProfiles />
        <AlumProfiles />
      </div>
      <div className="flex ml-4 md:max-w-[20%]">
        <Timeline events={events} />
      </div>

    </div>
  )
}

export default AboutPage