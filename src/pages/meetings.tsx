import React from "react"
import { Link, graphql } from "gatsby"

import Seo from "../components/Seo"
import { weekNumber, convertDate, formatSemester } from "../utils/util"
import { PdfSvg, YouTubeSvg } from "../components/Icons"

type Meeting = Queries.MeetingsPageQuery["allMeeting"]["meetings"][0]

interface Props {
  data: Queries.MeetingsPageQuery 
}

export function Head() {
  return (
    <Seo
      title="Meetings"
      description="Index of all SIGPwny meetings"
    />
  )
}

const MeetingRow = ({ meeting }: { meeting: Meeting }) => (
  <li key={meeting.slug} className="flex flex-row px-2 py-1 -mx-2 gap-x-4 rounded-lg hover:bg-surface-200">
    <div className="hidden sm:flex sm:flex-col min-w-max ">
      <span className="font-mono">{convertDate(meeting.time_start, "YYYY-MM-DD", meeting.timezone)}</span>
    </div>
    <div className="flex flex-row w-full md:w-3/5 truncate justify-between">
      <Link to={`${meeting.slug}`} className="truncate">
        <span className="font-mono">Week {weekNumber(meeting.week_number)}</span>: {meeting.title}
      </Link>
      <div className="flex flex-row">
        {meeting.recording && (
          <a
            href={meeting.recording}
            title={"Watch video"}
            className="mx-2"
          >
            <YouTubeSvg />
          </a>
        )}
        {meeting.slides?.publicURL && (
          <a
            href={meeting.slides.publicURL}
            title={"Download slides"}
            className="mx-2"
          >
            <PdfSvg />
          </a>
        )}
      </div>
    </div>
    <div className="hidden md:flex md:flex-col md:w-1/5 overflow-x-auto whitespace-nowrap no-scrollbar">
      {meeting.credit.length > 0 ? meeting.credit.join(', ') : "SIGPwny" }
    </div>
  </li>
)

const MeetingsPage = ({ data }: Props) => {
  const meetingsBySemester = data.allMeeting.meetings
  .reduce(
    (acc, meeting) => {
      const semester = meeting.semester
      if (!semester) return acc
      if (acc[semester]) {
        acc[semester].push(meeting)
      } else {
        acc[semester] = [meeting]
      }
      return acc
    }, {} as {[semester: string]: Meeting[]
  })
  return (
    <section id="meetings" className="pb-8">
      <div className="flex flex-col mx-auto page-width">
        <h1>Meetings</h1>
        <div className="panel">
          {Object.entries(meetingsBySemester).map(([semester, meetings]) => (
            <div key={semester}>
              <p className="font-bold text-2xl m-0">{formatSemester(semester)}</p>
              <ul className="flex flex-col pb-2">
                {meetings.map((meeting: Meeting) => (
                  <MeetingRow meeting={meeting} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MeetingsPage

export const query = graphql`
  query MeetingsPage {
    allMeeting(sort: {time_start: DESC}) {
      meetings: nodes {
        title
        time_start
        timezone
        week_number
        credit
        image {
          path {
            childImageSharp {
              gatsbyImageData(width: 600, placeholder: BLURRED)
            }
          }
          alt
        }
        slides {
          publicURL
        }
        recording
        semester
        slug
      }
    }
  }
`