import React from "react";
import { Link, graphql } from "gatsby";

import Seo from "../components/Seo";
import { CardGrid, createCard } from "../components/Card";

interface Props {
  data: Queries.SponsorsPageQuery
}

type Sponsor = Queries.SponsorsPageQuery["allOrg"]["nodes"][0];

export function Head() {
  return (
    <Seo
      title="Sponsors"
      description="Thank you to our sponsors!"
    />
  );
}

const SponsorsPage = ({ data }: Props) => {
  const sponsors = data.allOrg.nodes;
  const sponsor_cards = sponsors.map((sponsor: Sponsor) =>
    createCard({sponsor} as CardSponsorProps));
  return (
    <div className="flex flex-col mx-auto 2xl:w-5/6">
      <h1>Sponsors</h1>
      <CardGrid cards={sponsor_cards} />
    </div>
  );
}

export default SponsorsPage;

export const query = graphql`
  query SponsorsPage {
    allOrg(
      filter: {role: {eq: "Sponsor"}}
      sort: [{weight: DESC}, {name: ASC}]
    ) {
      nodes {
        name
        profile_image {
          childImageSharp {
            gatsbyImageData(width: 160, aspectRatio: 1)
          }
        }
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
        affiliation
        handle
        bio
        role
        weight
        links {
          name
          link
        }
      }
    }
  }
`;