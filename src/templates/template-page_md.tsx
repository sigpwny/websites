import React from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"

import Seo from "../components/Seo"

interface Props {
  data: Queries.PageMarkdownTemplateQuery
  children: React.ReactNode
}

export const Head = ({ data }: Props) => {
  const { pageMarkdown } = data
  if (!pageMarkdown) {
    throw new Error(`invalid argument: "pageMarkdown" is undefined`)
  }
  return (
    <Seo
      title={pageMarkdown.title}
      description={pageMarkdown.description}
    />
  )
}

const PageMarkdownTemplate = ({ data, children }: Props) => {
  const { pageMarkdown } = data
  if (!pageMarkdown) {
    throw new Error(`invalid argument: "pageMarkdown" is undefined`)
  }
  return (
    <MDXProvider>
      <div
        className={"md-root mx-auto" +
          (pageMarkdown.options?.full_width ? "" : " page-width") +
          (pageMarkdown.options?.no_background ? "" : " panel")
        }
      >
        {children}
      </div>
    </MDXProvider>
  )
}
export default PageMarkdownTemplate

export const query = graphql`
  query PageMarkdownTemplate($id: String!) {
    pageMarkdown(id: { eq: $id }) {
      title
      description
      options {
        full_width
        no_background
      }
    }
  }
`