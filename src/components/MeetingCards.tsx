import React from "react"
import { Link, useStaticQuery, graphql, navigate } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import { weekNumber, convertDate } from "../utils/util"


type Meeting = Queries.MeetingCardsQuery["allMeeting"]["meetings"][0]

const MeetingCards = () => {
  const data = useStaticQuery(graphql`
    query MeetingCards {
      allMeeting(
        filter: {featured: {eq: true}}
        sort: {time_start: DESC}
      ) {
        meetings: nodes {
          title
          time_start
          time_close
          week_number
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
      site {
        siteMetadata {
          timezone
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
              {meeting.image && meeting.image.path ? (
                <div className="content" style={{backgroundImage: `url('` + meeting.image.path.childImageSharp?.gatsbyImageData.images.fallback?.src + `')`}}>
                </div>
              ) : (
                <StaticImage className="content" src="../images/placeholder.png" alt="Placeholder image" />
              )}
            </div>
            <div className="p-2">
              <div className="card-line-clamp">
                <p className="font-mono font-size-small m-0">
                  {meeting.semester} Week {weekNumber(meeting.week_number)} &bull; {convertDate(meeting.time_start, "YYYY-MM-DD", data.site!.siteMetadata.timezone)}
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