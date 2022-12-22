

import React from "react"
import { graphql } from "gatsby"

interface Props {
  data: Queries.MeetingTemplateQuery
}

const MeetingTemplate = ({ data }: Props) => {
  const { curr, prev, next } = data
  if (!curr) {
    return (
      <>
        <h1>500 Error</h1>
        <p>Meeting not found</p>
      </>
    )
  }
  const html_data = (curr.parent as { html: string }).html
  return (
    <>
      <h1>{curr.title}</h1>
      <h2>{curr.date}</h2>
      
      {curr.parent && <div
        className="page-content"
        dangerouslySetInnerHTML={{ __html: html_data }}
      />}
      {/* {frontmatter.slides && (
        <object data={frontmatter.slides.publicURL} type="application/pdf" width="100%" height="100%">
          <p>It appears you don't have a PDF plugin for this browser.</p>
        </object>
      )} */}
      {/* <p>{frontmatter.slides?.publicURL}</p> */}
    </>
  )
}

export default MeetingTemplate

export const query = graphql`
  query MeetingTemplate(
    $id: String!
    $prev_id: String
    $next_id: String
  ) {
    curr: meeting(id: { eq: $id }) {
      parent {
        ... on MarkdownRemark {
          html
        }
      }
      date(formatString: "MMMM DD, YYYY")
      title
    }
    prev: meeting(id: { eq: $prev_id }) {
      title
      slug
    }
    next: meeting(id: { eq: $next_id }) {
      title
      slug
    }
  }
`