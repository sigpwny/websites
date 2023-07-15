import React from "react"
import { graphql, Link } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import { MDXProvider } from "@mdx-js/react"

import Seo from "../components/Seo"
import { convertDate } from "../utils/util"

interface Props {
  data: Queries.PublicationTemplateQuery
  children: React.ReactNode
}

export const Head = ({ data }: Props) => {
  const { publication } = data
  if (!publication) {
    throw new Error(`invalid argument: "publication" is undefined`)
  }
  return (
    <Seo
      title={publication.title}
      description={publication.description ? publication.description : undefined}
      image={publication.image?.path ? (
        publication.image.path.childImageSharp?.gatsbyImageData.images.fallback?.src
      ) : undefined}
    />
  )
}

const PublicationTemplate = ({ data, children }: Props) => {
  const { publication } = data
  if (!publication) {
    throw new Error(`invalid argument: "publication" is undefined`)
  }
  return (
    <div className="mx-auto panel page-width">
      <h1>{publication.title}</h1>
      <div>
        <p>{convertDate(publication.date, "MMM DD, YYYY", publication.timezone)} - {publication.credit.join(', ')}</p>
        <div className="flex flex-row">
          {publication.tags?.map((tag) => (
            <span className="rounded-lg bg-primary text-white">{tag}</span>
          ))}
        </div>
      </div>
      <p>{publication.description}</p>
      <Link to={publication.primary_link || ''} className="btn-primary">Check it out</Link>
      {publication.other_links && 
        <div className="mt-4">
          <h3>Additional Links</h3>
          <ul>
            {publication.other_links.map((link) => (
              <li><a href={link || ''}>{(link||'').slice(0,50) + (((link||'').length > 50) ? '...' : '')}</a></li>
            ))}
          </ul>
        </div>
      }
      <div className="max-w-prose mx-auto">
        <GatsbyImage
          image={publication.image.path.childImageSharp?.gatsbyImageData as IGatsbyImageData}
          alt={publication.image.alt}
          className="rounded-xl"
        />
      </div>
      <MDXProvider>
        <div className="md-root w-full max-w-prose mx-auto">
          {children}
        </div>
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
      timezone
      description
      image {
        path {
          childImageSharp {
            gatsbyImageData(width: 1024, placeholder: BLURRED)
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