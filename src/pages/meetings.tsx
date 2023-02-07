import React from "react"
import { Link, graphql } from "gatsby"

import Seo from "../components/Seo"
import { weekNumber, convertDate } from "../utils/util"
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

const MeetingsPage = ({ data }: Props) => {
  const meetings = data.allMeeting.meetings
  const meetingsBySemester: {[semester: string]: Meeting[]} = {}
  meetings.forEach((meeting: Meeting) => {
    const semester = meeting.semester!
    if (meetingsBySemester[semester]) {
      meetingsBySemester[semester].push(meeting)
    } else {
      meetingsBySemester[semester] = [meeting]
    }
  })
  return (
    <>
      <section id="meetings" className="pb-8">
        {/* <h1>Meetings</h1> */}
        <div className="flex flex-col panel mx-auto xl:w-2/3 lg:w-4/5">
          {Object.keys(meetingsBySemester).map((semester: string) => {
            return (
              <>
                <p className="font-bold text-2xl m-0">{semester}</p>
                <div className="flex flex-col pb-2">
                  {meetingsBySemester[semester].map((meeting: Meeting) => {
                    return (
                      <div className="flex flex-row gap-x-4">
                        <div className="hidden sm:flex sm:flex-col min-w-max ">
                          <span className="font-mono">{convertDate(meeting.time_start, "YYYY-MM-DD", data.site!.siteMetadata.timezone)}</span>
                        </div>
                        <div className="flex flex-col md:w-3/5 truncate">
                          <Link to={`${meeting.slug}`} className="truncate">
                            <span className="font-mono">Week {weekNumber(meeting.week_number)}</span>: {meeting.title}
                          </Link>
                        </div>
                        <div className="hidden md:flex md:flex-col min-w-[1/5] truncate">
                          {meeting.credit.length > 0 ? (
                            // print each credit, separated by a comma
                            meeting.credit.map((credit: string, index: number) => (
                              <>{credit}{index < meeting.credit.length - 1 ? ", " : ""}</>
                            ))
                          ) : "SIGPwny" }
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )
          })}
        </div>
      </section>
    </>
  )
}

export default MeetingsPage

export const query = graphql`
  query MeetingsPage {
    allMeeting(sort: {time_start: DESC}) {
      meetings: nodes {
        title
        time_start
        week_number
        credit
        image {
          path {
            childImageSharp {
              gatsbyImageData(width: 600, quality: 100)
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
    site {
      siteMetadata {
        timezone
      }
    }
  }
`