import React from "react"
import { graphql, Link } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import { MDXProvider } from "@mdx-js/react"
import { convertDate } from "../utils/util"

import Seo from "../components/Seo"
import PublicationSidebar from "../components/PublicationsSidebar"

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
    <div className="flex flex-row gap-x-4">
      <aside className="xl:w-96 lg:w-80 lg:block hidden">
        <PublicationSidebar />
      </aside>
      <div className="panel w-full grow">
        <div className="panel">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 justify-self-center">
                <GatsbyImage
                  image={publication.image.path.childImageSharp?.gatsbyImageData as IGatsbyImageData}
                  alt={publication.image.alt}
                  className="rounded-lg"
                  />
            </div>
            <div className="col-span-2">
              <div className="flex flex-row justify-center">
                <h1>{publication.title}</h1>
              </div>
              <div>

              <p>{publication.formatted_date} - {publication.credit.join(', ')}</p>
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
              <MDXProvider>
                <div className="md-root">
                  {children}
                </div>
              </MDXProvider>
            </div>
          </div>
        </div>
      </div>
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
      formatted_date: date(formatString: "MMM DD, YYYY")
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
    site {
      siteMetadata {
        timezone
      }
    }
  }
`