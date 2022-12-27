import React from "react"
import { graphql, useStaticQuery } from "gatsby"

interface Props {
  title?: string
  description?: string
  image?: string
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
        }
      }
    }
  `)
  const site_name = query.site.siteMetadata.title
  const title = props.title ? props.title + "|" + site_name : site_name
  const description = props.description || query.site.siteMetadata.description
  const twitter_card_type = props.image ? "summary_large_image" : "summary"
  const image = props.image ? query.site.siteMetadata.siteUrl + props.image : query.site.siteMetadata.image
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
      <meta property="og:type" content="website" />
      <meta property="twitter:card" content={twitter_card_type} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta name="robots" content={robots} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content={color} />
      <link rel="preload" href="/fonts/helveticaneue.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    </>
  )
}

export default Seo