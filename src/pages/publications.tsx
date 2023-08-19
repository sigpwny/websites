import React from "react";
import { graphql } from "gatsby";

import { CardGrid, createCard } from "../components/Card";
import Seo from "../components/Seo";

interface Props {
  data: Queries.PublicationsPageQuery;
}

export const Head = () => {
  return (
    <Seo
      title="Publications"
      description="Index of all featured SIGPwny publications"
    />
  );
};

const PublicationsPage = ({ data }: Props) => {
  const publications = data.allPublication.nodes;
  const publication_cards = publications.map((p) =>
    createCard({ publication: p } as CardPublicationProps)
  );
  return (
    <section id="publications" className="pb-8">
      <h1>Publications</h1>
      <CardGrid cards={publication_cards} />
    </section>
  );
};

export default PublicationsPage;

export const query = graphql`
  query PublicationsPage {
    allPublication(sort: {date: DESC}) {
      nodes {
        title
        credit
        publication_type
        publisher
        date
        card_image {
          foreground {
            publicURL
          }
          background {
            publicURL
          }
          foreground_image {
            childImageSharp {
              gatsbyImageData(width: 600)
            }
          }
          background_image {
            childImageSharp {
              gatsbyImageData(width: 600, placeholder: BLURRED)
            }
          }
          background_color
          alt
        }
        slug
      }
    }
  }
`;