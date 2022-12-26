import React from "react"
import { Link, useStaticQuery, graphql, navigate } from "gatsby"

import { weekNumber } from "../utils/util"

type Meeting = Queries.MeetingCardsQuery["allMeeting"]["meetings"][0]

const MeetingCards = () => {
  const data = useStaticQuery(graphql`
    query MeetingCards {
      allMeeting(
        filter: {featured: {eq: true}}
        sort: {date: DESC}
      ) {
        meetings: nodes {
          date(formatString: "YYYY-MM-DD")
          week_number
          title
          image {
            path {
              childImageSharp {
                gatsbyImageData(width: 500, quality: 100)
              }
            }
            alt
          }
          semester
          slug
        }
      }
    }
  `)
  return (
    <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-8">
      <div className="card h-100">
        <div className="p-2">
          <div className="card-line-clamp">
            <p className="card-text">Upcoming Meetings</p>
          </div>
        </div>
      </div>

      {data.allMeeting.meetings.map((meeting: Meeting) => (
        <Link to={meeting.slug} className="use-color-text">
          <div className="card h-100">
            <div className="aspect-ratio-16-9">
              <div className="content" style={{backgroundImage: `url('` + meeting.image.path.childImageSharp?.gatsbyImageData.images.fallback?.src + `')`}}>
              </div>
            </div>
            <div className="p-2">
              <div className="card-line-clamp">
                <p className="font-mono font-size-small m-0">
                  {meeting.semester} Week {weekNumber(meeting.week_number)} &bull; {meeting.date}
                </p>
                <p className="card-text">{meeting.title}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default MeetingCards