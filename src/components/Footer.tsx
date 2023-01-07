import React from "react"
import { DiscordSvg, GithubSvg, PwnySvg, YouTubeSvg, TwitterSvg } from "./Icons"
import { Link, useStaticQuery, graphql } from "gatsby"

// SiteSiteMetadataSocialLinks

const Footer = () => {
  const icons : Map<string, JSX.Element> = new Map([
    ["Twitter", <TwitterSvg />],
    ["Youtube", <YouTubeSvg />],
    ["GitHub", <GithubSvg />],
    ["Discord", <DiscordSvg />]
  ])

  // Stopping here as I have some concerns with this design pattern :/
  const data : Queries.SiteSiteMetadataSocialLinks[] = useStaticQuery(graphql`
    query Nav {
      site {
        siteMetadata {
          navLinks {
            name
            link
          }
          socialLinks {
            name
            link
          }
        }
      }
    }
  `)

  return (
  <footer>
    <div className="container flex flex-col-reverse md:flex-row">
      <div className="flex flex-col">
        <div>
          <PwnySvg height="10em" /> 
        </div>
        <div>
          <p className="text-xs">
            Copyright (c) SIGPwny. ACM@UIUC is a 501(c)(3) non-profit organization.
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div>
          <h1>Sitemap</h1>
          <Link to={""} className="truncate" activeClassName="font-bold">
                
          </Link>
        </div>
        <div>
          <h1>Connect</h1>
        </div>
      </div>
    </div>
  </footer>
  )
}

export default Footer