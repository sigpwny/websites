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
        filter: {fileAbsolutePath: {glob: "**/meetings/**"}, frontmatter: {archived: {eq: false}}}
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
    <div className="row">
      {meetings.allMeetings.meetings.map((meeting: Meeting) => (
        <div className="col-xl-3 col-lg-4 col-md-6 pb-4" key={meeting.fileAbsolutePath}>
          <a href={`/${meeting.parent.sourceInstanceName}/${meeting.frontmatter.date}`} className="use-color-text">
            <div className="card card-link h-100">
              <div className="aspect-ratio-16-9">
                <div className="content" style={{backgroundImage: `url('` + meeting.frontmatter.image.path.childImageSharp.gatsbyImageData.images.fallback?.src + `')`}}>
                </div>
              </div>
              <div className="card-body">
                <div className="card-line-clamp">
                  <p className="monospace-font font-size-small m-0">
                    {meeting.frontmatter.date}
                  </p>
                  <p className="card-text">{meeting.frontmatter.title}</p>
                </div>
              </div>
            </div>
          </a>
        </div>
      ))}
    </div>
  )
}

export default MeetingCards