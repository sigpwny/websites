import React from "react"
import { graphql } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import { MDXProvider } from "@mdx-js/react"

import Seo from "../components/Seo"

interface Props {
  data: Queries.PublicationTemplateQuery
  children: React.ReactNode
}

export const Head = ({ data }: Props) => {
  const { publication } = data
  if (!publication) {
    throw new Error(`invalid argument: "publication" is null`)
  }
  return (
    <Seo
      title={publication.title}
      description={publication.description ? publication.description : undefined}
      image={publication.image && publication.image.path ? (
        publication.image.path.childImageSharp?.gatsbyImageData.images.fallback?.src
      ) : undefined}
    />
  )
}

const PublicationTemplate = ({ data, children }: Props) => {
  const { publication } = data
  if (!publication) {
    throw new Error(`invalid argument: "publication" is null`)
  }
  return (
    <div className="panel">
      <GatsbyImage
        image={publication.image.path.childImageSharp?.gatsbyImageData as IGatsbyImageData}
        alt={publication.image.alt}
      />
      <h1>{publication.title}</h1>
      <p>{publication.description}</p>
      <MDXProvider>
        {children}
      </MDXProvider>
    </div>
  )
}

export default PublicationTemplate

export const query = graphql`
  query PublicationTemplate($id: String!) {
    publication(id: { eq: $id }) {
      title
      credit
      publication_type
      publisher
      date
      description
      image {
        path {
          childImageSharp {
            gatsbyImageData(
              width: 600,
              quality: 100,
              placeholder: NONE,
            )
          }
        }
        alt
      }
      primary_link
      other_links
      tags
      slug
    }
  }
`