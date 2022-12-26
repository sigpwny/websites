import React from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"

interface Props {
  // data: Queries.PageMarkdownTemplateQuery
  children: React.ReactNode
}

const PageMarkdownTemplate = ({ children }: Props) => {
  return (
    <>
      <div className="panel">
        <MDXProvider>
          {children}
        </MDXProvider>
      </div>
    </>
  )
}
export default PageMarkdownTemplate

// export const query = graphql`
//   query PageMarkdownTemplate($id: String!) {
//     pageMarkdown(id: { eq: $id }) {
//       title
//     }
//   }
// `