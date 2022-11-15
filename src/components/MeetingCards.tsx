import React from "react"
import { Link, useStaticQuery, graphql, navigate } from "gatsby"
import { IGatsbyImageData } from "gatsby-plugin-image"

interface Frontmatter {
  title: string
  credit: string
  date: string
  image: {
    path: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
    }
    alt: string
  }
}

interface Meeting {
  fileAbsolutePath: string
  parent: {
    sourceInstanceName: string
  }
  frontmatter: Frontmatter
}

interface MdxQuery {
  allMeetings: {
    meetings: Meeting[]
  }
}

const MeetingCards = () => {
  const meetings: MdxQuery = useStaticQuery(graphql`
    query {
      allMeetings: allMarkdownRemark(
        filter: {fileAbsolutePath: {glob: "**/meetings/**"}, frontmatter: {featured: {eq: true}}}
        sort: {fields: frontmatter___date, order: DESC}
      ) {
        meetings: nodes {
          fileAbsolutePath
          parent {
            ... on File {
              sourceInstanceName
            }
          }
          frontmatter {
            title
            credit
            date(formatString: "YYYY-MM-DD")
            image {
              path {
                childImageSharp {
                  gatsbyImageData(width: 500, quality: 100)
                }
              }
              alt
            }
          }
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

      {meetings.allMeetings.meetings.map((meeting: Meeting) => (
        // <div key={meeting.fileAbsolutePath}>
        <Link to={`/${meeting.parent.sourceInstanceName}/${meeting.frontmatter.date}`} className="use-color-text">
          <div className="card h-100">
            <div className="aspect-ratio-16-9">
              <div className="content" style={{backgroundImage: `url('` + meeting.frontmatter.image.path.childImageSharp.gatsbyImageData.images.fallback?.src + `')`}}>
              </div>
            </div>
            <div className="p-2">
              <div className="card-line-clamp">
                <p className="font-monospace font-size-small m-0">
                  {/* display month number from meeting.frontmatter.date */}
                  {parseInt(meeting.frontmatter.date.split("-")[1]) < 8 ? "FA" : "SP"}{meeting.frontmatter.date.split("-")[0]} Week {} &bull; {meeting.frontmatter.date}
                </p>
                <p className="card-text">{meeting.frontmatter.title}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default MeetingCards