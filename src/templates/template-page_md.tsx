import React from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"

import Seo from "../components/Seo"

interface Props {
  data: Queries.PageMarkdownTemplateQuery
  children: React.ReactNode
}

export const Head = ({ data }: Props) => {
  return (
    <Seo
      title={data.pageMarkdown?.title}
    />
  )
}

const PageMarkdownTemplate = ({ data, children }: Props) => {
  return (
    <>
      {data.pageMarkdown && data.pageMarkdown?.no_background ? (
        <MDXProvider>
          <div className="md-root">
            {children}
          </div>
        </MDXProvider>
      ) : (
        <MDXProvider>
          <div className="md-root panel">
            {children}
          </div>
        </MDXProvider>
      )}
    </>
  )
}
export default PageMarkdownTemplate

export const query = graphql`
  query PageMarkdownTemplate($id: String!) {
    pageMarkdown(id: { eq: $id }) {
      title
      no_background
    }
  }
`