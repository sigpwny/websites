import React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { MDXProvider } from "@mdx-js/react";

import Seo from "../components/Seo";
import { convertDate } from "../utils/util";

interface Props {
  data: Queries.PublicationTemplateQuery
  children: React.ReactNode
}

export const Head = ({ data }: Props) => {
  const p = data.publication;
  if (!p) {
    throw new Error(`invalid argument: "publication" is undefined`);
  }
  const meta_image = 
    p.card_image.foreground?.publicURL ??
    p.card_image.background?.publicURL ??
    undefined;
  return (
    <Seo
      title={p.title}
      description={p.description ? p.description : undefined}
      image={meta_image}
    />
  );
}

const PublicationTemplate = ({ data, children }: Props) => {
  const p = data.publication;
  if (!p) {
    throw new Error(`invalid argument: "publication" is undefined`);
  }
  return (
    <div className="mx-auto panel page-width">
      <h1>{p.title}</h1>
      <div>
        <p>{convertDate(p.date, "MMM DD, YYYY")} - {p.credit.join(', ')}</p>
        <div className="flex flex-row">
          {p.tags?.map((tag) => (
            <span className="rounded-lg bg-primary text-white">{tag}</span>
          ))}
        </div>
      </div>
      <p>{p.description}</p>
      {p.primary_link ? (
        <a
          href={p.primary_link.url}
          className="btn-primary"
          target="_blank" rel="noopener noreferrer"
        >
          {p.primary_link.name}
        </a>
      ) : null}
      {p.links?.length && p.links.length > 0 ? ( 
        <div className="mt-4">
          <h3>Additional Links</h3>
          <ul>
            {p.links.map((link) => (
              <li>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="max-w-prose mx-auto">
        {/* <GatsbyImage
          image={p.image.path.childImageSharp?.gatsbyImageData as IGatsbyImageData}
          alt={p.image.alt}
          className="rounded-xl"
        /> */}
      </div>
      <MDXProvider>
        <div className="md-root w-full max-w-prose mx-auto">
          {children}
        </div>
      </MDXProvider>
    </div>
  );
};

export default PublicationTemplate;

export const query = graphql`
  query PublicationTemplate($id: String!) {
    publication(id: { eq: $id }) {
      title
      credit
      publication_type
      publisher
      date
      description
      card_image {
        foreground {
          publicURL
        }
        background {
          publicURL
        }
        foreground_image {
          childImageSharp {
            gatsbyImageData(width: 1024)
          }
        }
        background_image {
          childImageSharp {
            gatsbyImageData(width: 1024, placeholder: BLURRED)
          }
        }
        background_color
        alt
      }
      primary_link {
        name
        url
      }
      links {
        name
        url
      }
      tags
      slug
    }
  }
`;