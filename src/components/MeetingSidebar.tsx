import React, { useEffect } from "react"
import { Link, graphql, useStaticQuery } from "gatsby"

import { weekNumber, formatSemester } from "../utils/util"

type Meeting = Queries.MeetingSidebarQuery["allMeeting"]["meetings"][0]

const MeetingSidebar = () => {
  const data = useStaticQuery(graphql`
    query MeetingSidebar {
      allMeeting(sort: {time_start: DESC}) {
        meetings: nodes {
          week_number
          title
          semester
          slug
        }
      }
    }
  `)
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
  const activeRef = React.useRef<HTMLAnchorElement>(null)
  const isActive = ({ isCurrent }: {isCurrent: boolean}) => {
    return isCurrent ? {
      ref: activeRef,
      className: "truncate font-bold"
    } : {
      className: "truncate"
    }
  }

  const scrollToActive = () => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }
  
  useEffect(scrollToActive, [])

  return (
    <div className="panel-p-0 sticky top-4 overflow-hidden rounded-xl py-4">
      <div className="px-4 flex flex-col h-[75vh] overflow-y-auto custom-scrollbar">
        {Object.keys(meetingsBySemester).map((semester: string) => (
          <div key={semester}>
            <p className="font-bold text-2xl m-0">{formatSemester(semester)}</p>
            <div className="flex flex-col pb-2">
            {meetingsBySemester[semester].map((meeting: Meeting) => (
              <Link
                key={meeting.slug}
                to={`${meeting.slug}`}
                getProps={isActive}
              >
                <span className="font-mono">Week {weekNumber(meeting.week_number)}</span>: {meeting.title}
              </Link>
            ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MeetingSidebar
