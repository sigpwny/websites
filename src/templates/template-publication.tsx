import React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { MDXProvider } from "../components/MDXProvider";

import Seo from "../components/Seo";
import { AvatarPersona } from "../components/Profile";
import { Card } from "../components/Card";
import { TagGroup } from "../components/Tag";
import { Tooltip } from "../components/Tooltip";

interface Props {
  data: Queries.PublicationTemplateQuery;
  children: React.ReactNode;
}

export const Head = ({ data }: Props) => {
  const p = data.publication;
  if (!p) throw new Error(`invalid argument: "publication" is undefined`);
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
};

const PublicationTemplate = ({ data, children }: Props) => {
  const p = data.publication;
  if (!p) throw new Error(`invalid argument: "publication" is undefined`);
  return (
    <div className="flex w-full justify-center">
      <div className="panel inline-flex overflow-hidden">
        <article className="max-w-prose overflow-hidden" itemScope itemType="http://schema.org/Article">
          <header>
            <div className="flex flex-col">
              <h1 className="mb-1" itemProp="headline">
                {p.title}
              </h1>
              <span className="font-mono order-first">
                <time dateTime={p.iso_date}>
                  {p.full_date}
                  {" • " + p.publication_type.toUpperCase()}
                  {p.publisher ? ` • ${p.publisher}` : null}
                </time>
              </span>
              {p.tags && p.tags.length > 0 ? (
                <div className="flex flex-row mb-1">
                  <TagGroup tags={p.tags.concat()} />
                </div>
              ) : null}
              {p.credit_profiles?.length > 0 ? (
                <div className="flex flex-col md:flex-row flex-shrink-0 flex-wrap gap-x-2 gap-y-1 md:items-center mb-2">
                  {p.credit_profiles.map((prof, idx) => {
                    const profile = (prof ?? { name: p.credit[idx] }) as ProfileBasicProps;
                    return (
                      <AvatarPersona key={idx} profile={profile}>
                        <span rel="author" itemProp="author">
                          {profile.name}
                        </span>
                        {idx === p.credit_profiles.length - 1 ? null : (
                          <span className="hidden md:block">,</span>
                        )}
                      </AvatarPersona>
                    );
                  })}
                </div>
              ) : null}
            </div>
            {p.description ? (
              <p>
                {p.description}
              </p>
            ) : null}
          </header>
          <div className="mb-8">
            <Card card_image={p.card_image as CardImageProps} />
          </div>
          {p.primary_link ? (
            <div className="mb-4">
              <p className="text-2xl m-0 font-bold">
                Primary Source
              </p>
              <a
                href={p.primary_link.url}
                target="_blank" rel="noopener noreferrer"
              >
                {p.primary_link.name}
              </a>
              <p className="text-sm m-0 font-mono">
                {p.primary_link.url}
              </p>
            </div>
          ) : null}
          {p.links?.length && p.links.length > 0 ? ( 
            <div className="mb-4">
              <p className="text-2xl m-0 font-bold break-words">
                Additional Links
              </p>
              <ul>
                {p.links.map((link) => (
                  <li>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.name}
                    </a>
                    <p className="text-sm m-0 font-mono break-words">
                      {link.url}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <MDXProvider>
            <section className="md-root" itemProp="articleBody">
              {children}
            </section>
          </MDXProvider>
          <span className="z-50 hidden md:block">
            <Tooltip.Profile offset={3} place="bottom-start" />
          </span>
        </article>
      </div>
    </div>
  );
};

export default PublicationTemplate;

export const query = graphql`
  query PublicationTemplate($id: String!) {
    publication(id: { eq: $id }) {
      title
      credit
      credit_profiles {
        name
        profile_image {
          childImageSharp {
            gatsbyImageData(width: 160, aspectRatio: 1)
          }
        }
        handle
        links {
          name
          url
        }
        role
      }
      publication_type
      publisher
      iso_date: date(formatString: "YYYY-MM-DD")
      full_date: date(formatString: "MMMM Do, YYYY")
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
    }
  }
`;