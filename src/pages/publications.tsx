import React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

import { CardGrid, createCard } from "../components/Card"
import Seo from "../components/Seo"
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
  const publication_cards = publications.map((p: Publication) =>
    createCard({ publication: p } as CardPublicationProps)
  )
  return (
    <section id="publications" className="pb-8">
      <h1>Publications</h1>
      <CardGrid cards={publication_cards} />
    </section>
  )
}

export default PublicationsPage

export const query = graphql`
  query PublicationsPage {
    allPublication(sort: {date: DESC}) {
      publications: nodes {
        title
        credit
        publication_type
        publisher
        date
        timezone
        image {
          path {
            childImageSharp {
              gatsbyImageData(width: 600, placeholder: BLURRED)
            }
          }
          alt
        }
        slug
      }
    }
  }
`