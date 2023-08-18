import React, { useState } from "react"
import { Link, graphql } from "gatsby"
import { motion } from "framer-motion"
import { StaticImage } from "gatsby-plugin-image"

import Seo from "../../components/Seo"
import { ProfileCardGrid } from "../../components/Profile"
import Timeline, { type Event } from "../../components/Timeline"

// import "./about.css"

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

const SIGPwnyMorphology = () => {
  const [isExpanded, setExpanded] = useState(false)
  const [isFirstRender, setFirstRender] = useState(true)
  if (isFirstRender) {
    setFirstRender(false)
    setTimeout(() => {
      setExpanded(true)
    }, 200)
  }
  const variants = {
    minimized: {
      opacity: 0,
      transition: {
        duration: 0.0,
        delay: 0.0,
      }
    },
    expanded: {
      opacity: 1,
      transition: {
        duration: 0.2,
        delay: 0.5,
      },
    }
  }
  return (
    <motion.div
      layout
      className="flex flex-row mx-auto my-6 cursor-pointer select-none"
      onClick={() => setExpanded(!isExpanded)}
    >
      <motion.div layout className="flex flex-col">
        <p className="text-primary font-bold text-right text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
          SIG
        </p>
        <motion.div
          layout
          variants={variants}
          initial="minimized"
          animate={isExpanded ? "expanded" : "minimized"}
        >
          <p className="text-center">&#8595;</p>
          <p className="font-bold text-center">
            Special <br />Interest <br />Group
          </p>
        </motion.div>
      </motion.div>
      <motion.div
        layout
        className={"flex flex-col" + (isExpanded ? "" : " hidden")}
        variants={variants}
        initial="minimized"
        animate={isExpanded ? "expanded" : "minimized"}
      >
        <p className="text-primary font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
          &nbsp;&bull;&nbsp;
        </p>
      </motion.div>
      <motion.div layout className="flex flex-col">
        <p className="text-primary font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
          Pwn
        </p>
        <motion.div
          layout
          variants={variants}
          initial="minimized"
          animate={isExpanded ? "expanded" : "minimized"}
        >
          <p className="text-center">&#8595;</p>
          <p className="font-bold text-center">
            To hack <br />or "own" <br />(slang)
          </p>
        </motion.div>
      </motion.div>
      <motion.div
        layout
        className={"flex flex-col" + (isExpanded ? "" : " hidden")}
        variants={variants}
        initial="minimized"
        animate={isExpanded ? "expanded" : "minimized"}
      >
        <p className="text-primary font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
          &nbsp;&bull;&nbsp;
        </p>
      </motion.div>
      <motion.div layout className="flex flex-col">
        <p className="text-primary font-bold text-left text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
          y
        </p>
        <motion.div
          layout
          variants={variants}
          initial="minimized"
          animate={isExpanded ? "expanded" : "minimized"}
        >
          <p className="text-center">&#8595;</p>
          <p className="font-bold text-center">
            For <br />cool <br />logo
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

const AboutPage = ({ data }: any) => {
  const [isFocused, setIsFocused] = useState(false)
  const button_page_transition_duration = 0.2
  const fm_variants = {
    sentence: {
      hidden: {
        opacity: 1,
      },
      visible: {
        opacity: 1,
        transition: {
          delay: 0.5,
          delayChildren: button_page_transition_duration + 0.2,
          staggerChildren: 0.05,
        },
      },
    },
    letter: {
      hidden: {
        y: "100%",
      },
      visible: {
        y: 0,
        transition: {
          ease: "easeOut",
        }
      },
    }
  }

  return (
    <div className="flex flex-col md:flex-row justify-between">
      <div className="flex flex-col gap-8">
        <section id="acronym" className="py-8">
          <div className="flex flex-col">
            <SIGPwnyMorphology />
            <div className="flex flex-row justify-center">
              <p>sig-<b>poh</b>-nee</p>
              {/* <p>&nbsp;<small>[audio]</small></p> */}
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
                club content is designed to be approached by <em>anyone</em>, regardless of skill, major, or experience.
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
          <div className="text-center pb-8">
            <div className="panel mx-auto max-w-prose">
              <p className="font-bold text-4xl">Who are we?</p>
              <p className="m-0">
                SIGPwny is completely student-run and would not be able to support everyone without the contributions 
                from our admin team, helpers, and alumni.
              </p>
            </div>
          </div>
          <section id="admins" className="pb-8">
            <h1>Admin Team</h1>
            <ProfileCardGrid profiles={data.allAdmin.admins} />
          </section>
          <section id="helpers" className="pb-8">
            <h1>Helper Team</h1>
            <ProfileCardGrid profiles={data.allHelper.helpers} />
          </section>
          <section id="alumni" className="pb-8">
            <h1>Alumni</h1>
            <ProfileCardGrid profiles={data.allAlum.alumni} />
          </section>
        </section>
      </div>
      {/* <div className="flex ml-4 md:w-1/3 lg:w-1/4">
        <Timeline events={events} />
      </div> */}

    </div>
  )
}

export default AboutPage

export const query = graphql`
  query AboutPage {
    allAdmin(sort: [{weight: DESC}, {name: ASC}]) {
      admins: nodes {
        name
        profile_image {
          childImageSharp {
            gatsbyImageData(width: 300, placeholder: BLURRED, aspectRatio: 1)
          }
        }
        handle
        bio
        links {
          name
          url
        }
        role
        weight
      }
    }
    allHelper(sort: [{weight: DESC}, {name: ASC}]) {
      helpers: nodes {
        name
        profile_image {
          childImageSharp {
            gatsbyImageData(width: 300, placeholder: BLURRED, aspectRatio: 1)
          }
        }
        handle
        bio
        links {
          name
          url
        }
        role
        weight
      }
    }
    allAlum(sort: [{weight: DESC}, {name: ASC}]) {
      alumni: nodes {
        name
        profile_image {
          childImageSharp {
            gatsbyImageData(width: 300, placeholder: BLURRED, aspectRatio: 1)
          }
        }
        handle
        period
        work
        bio
        links {
          name
          url
        }
        role
        weight
      }
    }
  }
`