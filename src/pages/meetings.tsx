import React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image"

import { AvatarGroup } from "../components/Profile"
import Seo from "../components/Seo"
import { TagGroup } from "../components/Tag"
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
  <li>
    <div className="flex flex-row px-2 py-1 -mx-2 gap-x-4 rounded-lg hover:bg-surface-200">
      <div className="flex flex-row flex-grow lg:flex-grow-0 min-w-0 lg:w-1/2 xl:w-3/5 gap-x-4 items-center justify-content-center">
        <span className="hidden sm:flex font-mono min-w-max">
          {convertDate(meeting.time_start, "YYYY-MM-DD", meeting.timezone)}
        </span>
        <Link to={`${meeting.slug}`} className="truncate">
          <span>
            <span className="font-mono">Week {weekNumber(meeting.week_number)}</span>: {meeting.title}
          </span>
        </Link>
      </div>
      <div className="hidden lg:flex flex-row lg:flex-grow gap-x-4 truncate">
        {meeting.tags && meeting.tags.length > 0 && (
          <TagGroup tags={meeting.tags} char_limit={25} tag_limit={3} />
        )}
      </div>
      <div className="hidden md:flex flex-row gap-x-4 min-w-fit truncate">
        <div className="grid grid-cols-3" style={{gridTemplateColumns: `repeat(3, 2rem)`}}>
          <div className="flex items-center justify-items-center">
          </div>
          <div className="flex items-center justify-items-center">
            {meeting.recording && (
              <a
                href={meeting.recording}
                title={"Watch video"}
                className="px-2"
              >
                <YouTubeSvg />
              </a>
            )}
          </div>
          <div className="flex items-center justify-items-center">
            {meeting.slides?.publicURL && (
              <a
                href={meeting.slides.publicURL}
                title={"Download slides"}
                className="px-2"
              >
                <PdfSvg />
              </a>
            )}
          </div>
        </div>
        <AvatarGroup profiles={meeting.credit_profiles} count={3} />
      </div>
    </div>
    <hr className="border-surface-200" />
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
      <div className="flex flex-col mx-auto 2xl:w-5/6">
        <h1>Meetings</h1>
        <div className="panel">
          {Object.entries(meetingsBySemester).map(([semester, meetings]) => (
            <div key={semester}>
              <p className="font-bold text-2xl m-0">{formatSemester(semester)}</p>
              <hr className="border-surface-200" />
              <ul className="flex flex-col pb-2">
                {meetings.map((meeting, idx) => (
                  <MeetingRow key={idx} meeting={meeting} />
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
        credit_profiles {
          name
          profile_image {
            childImageSharp {
              gatsbyImageData(width: 600, placeholder: BLURRED)
            }
          }
        }
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
        tags
        semester
        slug
      }
    }
  }
`