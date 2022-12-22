import React from "react"
import { Link, graphql } from "gatsby"
import { StaticImage, IGatsbyImageData } from "gatsby-plugin-image"

import { PdfSvg, YouTubeSvg } from "../components/Icons"

type Meeting = Queries.MeetingsPageQuery["allMeeting"]["meetings"][0]

interface Props {
  data: Queries.MeetingsPageQuery 
}

export function Head() {
  return (
    <>
      <title>Meetings</title>
    </>
  )
}

const MeetingsPage = ({ data }: Props) => {
  const meetings = data.allMeeting.meetings
  const meetingsBySemester: {[semester: string]: Meeting[]} = {}
  meetings.forEach((meeting: Meeting) => {
    const semester = meeting.semester
    if (meetingsBySemester[semester]) {
      meetingsBySemester[semester].push(meeting)
    } else {
      meetingsBySemester[semester] = [meeting]
    }
  })
  return (
    <>
      <section id="meetings" className="pb-8">
        <h1>Meetings</h1>
        <div className="flex flex-col">
          <table>
            <thead></thead>
            {Object.keys(meetingsBySemester).map((semester: string) => {
              return (
                <>
                  <h2 className="m-0">{semester}</h2>
                  <thead>
                    <tr className="text-left">
                      <th>Date</th>
                      <th></th>
                      <th></th>
                      <th>Title</th>
                      <th>Author</th>
                    </tr>
                  </thead>
                  <tbody className="border-b-[1rem] border-transparent">
                    {meetingsBySemester[semester].map((meeting: Meeting) => {
                      return (
                        <tr>
                          <td className="font-mono">{meeting.date}</td>
                          <td className="pr-2">
                            {meeting.slides && meeting.slides.publicURL && (
                              <Link to={meeting.slides.publicURL} aria-label="Slides download link" title="Download slides" target="_blank" rel="noreferrer">
                                <PdfSvg />
                              </Link>
                            )}
                          </td>
                          <td className="pr-2">
                            {meeting.recording && meeting.recording !== "" && (
                              <a href={meeting.recording} aria-label="YouTube link" title="Watch on YouTube" target="_blank" rel="noreferrer">
                                <YouTubeSvg />
                              </a>
                            )}
                          </td>
                          <td>
                            <Link to={`${meeting.slug}`}>
                              {meeting.title}
                            </Link>
                          </td>
                          <td>{meeting.credit}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <span className="h-4 py-4"></span>
                </>
              )
            })}
          </table>
        </div>
      </section>
    </>
  )
}

export default MeetingsPage

export const query = graphql`
  query MeetingsPage {
    allMeeting(
      sort: {fields: date, order: DESC}
    ) {
      meetings: nodes {
        date(formatString: "YYYY-MM-DD")
        week_number
        title
        credit
        image {
          path {
            childImageSharp {
              gatsbyImageData(width: 500, quality: 100)
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