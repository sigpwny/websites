import React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

import Card from "../components/Card"
import Seo from "../components/Seo"
// import { weekNumber, convertDate } from "../utils/util"
import { PdfSvg, YouTubeSvg } from "../components/Icons"

type Publication = Queries.PublicationsPageQuery["allPublication"]["publications"][0]

interface Props {
  data: Queries.PublicationsPageQuery 
}

export function Head() {
  return (
    <Seo
      title="Publications"
      description="Index of all featured SIGPwny publications"
    />
  )
}

const PublicationsPage = ({ data }: Props) => {
  const publications = data.allPublication.publications
  return (
    <>
      <section id="publications" className="pb-8">
        <h1>Publications</h1>
        <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-8">
          {publications.map((publication: Publication) => (
            <Card
              heading={publication.publication_type.toUpperCase() + " • " + publication.publisher}
              title={publication.title}
              image={publication.image as Image}
              link={publication.slug!}
            />
          ))}
        </div>
      </section>
    </>
  )
}

export default PublicationsPage

export const query = graphql`
  query PublicationsPage {
    allPublication(sort: {time_start: DESC}) {
      publications: nodes {
        title
        credit
        publication_type
        publisher
        time_start
        image {
          path {
            childImageSharp {
              gatsbyImageData(width: 600, quality: 100)
            }
          }
          alt
        }
        slug
      }
    }
    site {
      siteMetadata {
        timezone
      }
    }
  }
`