import React from "react"
import { graphql, useStaticQuery } from "gatsby"

interface Props {
  title?: string
  description?: string
  image?: string
  video?: string
  type?: string
  color?: string
  disable_robots?: boolean
}

const Seo = (props: Props) => {
  const query = useStaticQuery(graphql`
    query Seo {
      site {
        siteMetadata {
          title
          description
          image
          siteUrl
          twitterUsername
        }
      }
    }
  `)
  const site_name = query.site.siteMetadata.title
  const title = props.title ? props.title : site_name
  const description = props.description || query.site.siteMetadata.description
  const twitter_card_type = props.image ? "summary_large_image" : "summary"
  const image = props.image ? query.site.siteMetadata.siteUrl + props.image : query.site.siteMetadata.image
  const type = props.type || "website"
  const color = props.color || "#33cc55"
  const robots = props.disable_robots ? "noindex, nofollow" : "index, follow"
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:site_name" content={site_name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {props.video ? (
        <>
          <meta property="og:video" content={props.video} />
          <meta property="og:video:type" content="text/html" />
          <meta property="og:video:url" content={props.video} />
          <meta property="og:video:width" content="1280" />
          <meta property="og:video:height" content="720" />
        </>
      ) : null}
      <meta property="og:type" content={type} />
      <meta property="twitter:card" content={twitter_card_type} />
      <meta property="twitter:site" content={query.site.siteMetadata.twitterUsername} />
      <meta property="twitter:image" content={image} />
      {props.video ? (
        <>
          <meta property="twitter:player" content={props.video} />
          <meta property="twitter:player:width" content="1280" />
          <meta property="twitter:player:height" content="720" />
        </>
      ) : null}
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta name="robots" content={robots} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#000000" />
      <link rel="preload" href="/fonts/helveticaneue.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    </>
  )
}

export default Seo
