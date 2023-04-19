import React from "react"

import Seo from "../components/Seo"
import CardRow from "../components/CardRow"
import { convertDate, weekNumber } from "../utils/util"
import { graphql } from "gatsby"

interface Props {
  data: Queries.IndexPageQuery
}

type Meeting = Queries.IndexPageQuery["allMeeting"]["meetings"][0]

export function Head() {
  return (
    <Seo
      title="Join"
      description="Join SIGPwny"
    />
  )
}

const JoinPage = ({ data }: Props) => {
  const meeting_cards = data.allMeeting.meetings.map((meeting: Meeting) => ({
    heading: meeting.semester + " Week " + weekNumber(meeting.week_number) + " • " + convertDate(meeting.time_start, "YYYY-MM-DD", data.site!.siteMetadata.timezone),
    title: meeting.title,
    image: meeting.image as Image,
    link: meeting.slug!
  }))
  return (
    <div className="px-10 lg:px-40">
      <section id="join-title" className="flex flex-row space-x-8 py-8 pb-8">
        <div className="flex flex-col flex-grow basis-1/2">
          <h1>Welcome to SIGPwny!</h1>
          <p className="text-3xl font-light tracking-wide mb-0">Come learn cybersecurity with 2000+ students, alum, and professionals on our Discord server.</p>
          <a href="https://discord.gg/cWcZ6a9" target="_blank" rel="noopener noreferrer"
            className="place-self-start font-bold text-xl lg:text-2xl my-3 leading-normal btn-primary"
          >
            Join Discord
          </a>
          <ul className="list-decimal ml-0 pl-5">
            <li>By joining, you agree to our club <a href="#" target="_blank" rel="noopener noreferrer">rules</a>.</li>
            <li>If you are a UIUC student, authenticate <a href="https://sigpwny.com/auth" target="_blank" rel="noopener noreferrer">here</a> to receive the @uiuc role and access club channels.</li>
          </ul>
        </div>
        <div className="basis-1/2 bg-neutral-800"></div>
      </section>

      <section id="join-involve" className="mt-8 pb-8">
        <h1>How to Get Involved</h1>
        <div className="flex flex-row flex-wrap content-between gap-4 mt-4">
          <div className="flex-grow-0 flex-shrink-0 basis-[32%] min-h-[200px] p-4 rounded-lg bg-neutral-800">
            Attend meetings (more text/graphic here)
          </div>
          <div className="flex-grow-0 flex-shrink-0 basis-[32%] min-h-[200px] p-4 rounded-lg bg-neutral-800">
            Compete in team CTFs (more text/graphic here)
          </div>
          <div className="flex-grow-0 flex-shrink-0 basis-[32%] min-h-[200px] p-4 rounded-lg bg-neutral-800">
            Do security research (more text/graphic here)
          </div>
        </div>
        <p className="mt-4 mb-0">SIGPwny is open to all - there are no member applications, mandatory meetings, or even required prerequisite knowledge.</p>
      </section>

      <section id="join-beginner" className="mt-8 pb-8">
        <h1>Beginner Topics</h1>
        <p className="mt-4 mb-4">Learn the fundamental skills to quickly get into hacking and more advanced topics!</p>
        <CardRow cards={meeting_cards} />
      </section>

      <section id="join-leadership" className="mt-8 pb-8">
        <h1>Leadership Opportunities</h1>
        <p className="mt-4 mb-0">TODO: talk about helper applications, our teams (marketing, infra, etc.), and meeting presenting</p>
      </section>
    </div>
  )
}

export default JoinPage

export const query = graphql`
  query JoinPage {
    site {
      siteMetadata {
        description
        timezone
      }
    }
    allMeeting(
      filter: {featured: {eq: true}}
      sort: {time_start: DESC}
      limit: 4
    ) {
      meetings: nodes {
        title
        time_start
        time_close
        week_number
        image {
          path {
            childImageSharp {
              gatsbyImageData(width: 600, quality: 100)
            }
          }
          alt
        }
        semester
        slug
      }
    }
  }
`