import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { Sidebar } from "../components/Sidebar";

import { formatSemester, weekNumber } from "../utils/util";

type Meeting = Queries.LayoutMeetingQuery["allMeeting"]["meetings"][0];

export const LayoutMeeting = ({ children }: { children: React.ReactNode }) => {
  const data = useStaticQuery(graphql`
    query LayoutMeeting {
      allMeeting(sort: {time_start: DESC}) {
        meetings: nodes {
          week_number
          title
          semester
          slug
        }
      }
    }
  `);
  const meetings = data.allMeeting.meetings;
  const meetings_by_semester: {[semester: string]: Meeting[]} = {};
  meetings.forEach((meeting: Meeting) => {
    const semester = meeting.semester!
    if (meetings_by_semester[semester]) {
      meetings_by_semester[semester].push(meeting);
    } else {
      meetings_by_semester[semester] = [meeting];
    }
  });
  const meetings_sidebar_items = Object.keys(meetings_by_semester).map((semester) => ({
    name: formatSemester(semester),
    items: meetings_by_semester[semester].map((meeting) => ({
      name: `Week ${weekNumber(meeting.week_number)}: ${meeting.title}`,
      url: meeting.slug,
    })),
  }));
  return (
    <div className="flex flex-row gap-x-4">
      <aside className="xl:w-96 lg:w-80 lg:flex flex-col flex-shrink-0 hidden">
        <div className="w-full border-surface-100 border-2 rounded-xl py-2 sticky top-4">
          <div className="w-full h-fit max-h-[75vh] px-2 overflow-hidden overflow-y-auto custom-scrollbar">
            <Sidebar root_items={meetings_sidebar_items} />
          </div>
        </div>
      </aside>
      {children}
    </div>
  )
}

export default LayoutMeeting;
