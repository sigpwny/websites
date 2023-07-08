import React, { useState } from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { motion } from "framer-motion"

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
  const [curr_sect, setCurrSect] = useState(-1)
  const [curr_link, setCurrLink] = useState(-1)
  return (
    <div className="panel-p-0 sticky top-4 overflow-hidden rounded-xl py-4">
      <div className="px-4 flex flex-col h-[75vh] overflow-y-auto custom-scrollbar">
        {Object.keys(meetingsBySemester).map((semester, semester_idx) => (
          <div key={semester_idx}>
            <p className="font-bold text-2xl m-0">{formatSemester(semester)}</p>
            <ul className="flex flex-col pb-2">
            {meetingsBySemester[semester].map((meeting, meeting_idx) => (
              <li key={meeting_idx} className="relative">
                <Link
                  to={`${meeting.slug}`}
                  getProps={({ isCurrent }) => {
                    if (isCurrent) {
                      setCurrSect(semester_idx)
                      setCurrLink(meeting_idx)
                      return {
                        className: "truncate font-bold"
                      }
                    }
                    return {
                      className: "truncate"
                    }
                  }}
                >
                  <div className="truncate">
                    <span className="font-mono">Week {weekNumber(meeting.week_number)}</span>: {meeting.title}
                  </div>
                  {(curr_sect === semester_idx && curr_link === meeting_idx) && (
                    <div className="flex h-full absolute top-0 -left-4">
                      <motion.div className=" h-4 w-1 bg-primary self-center" layoutId="active-indicator"></motion.div>
                    </div>
                  )}
                </Link>
              </li>
            ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MeetingSidebar
