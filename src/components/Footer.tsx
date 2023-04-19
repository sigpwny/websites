import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

import { DiscordSvg, GitHubSvg, InstagramSvg, TwitterSvg, YouTubeSvg, PwnyBanner } from "./Icons"

const Footer = () => {
  const icons : Map<string, JSX.Element> = new Map([
    ["Discord", <DiscordSvg />],
    ["GitHub", <GitHubSvg />],
    ["Instagram", <InstagramSvg />],
    ["Twitter", <TwitterSvg />],
    ["YouTube", <YouTubeSvg />]
  ])

  const data : Queries.FooterQuery = useStaticQuery(graphql`
    query Footer {
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
      <div className="container my-8">
        <hr />
        <div className="flex flex-col md:flex-row mt-8">
          <div className="flex flex-row basis-1/2 max-w-md mb-8">
            <div className="flex flex-col basis-1/2">
              <p className="font-bold m-0">Sitemap</p>
              {data.site?.siteMetadata?.navLinks?.map((item) => {
                if (item && item.name && item.link) {
                  return (
                    <p className="inline align-middle m-0">
                      <Link to={item.link} key={item.name}>
                        {item.link === "/" ? "Home" : item.name}
                      </Link>
                    </p>
                  )
                }
              })}
            </div>
            <div className="flex flex-col basis-1/2">
              <p className="font-bold m-0">Connect</p>
              {data.site?.siteMetadata?.socialLinks?.map((item) => {
                if (item && item.name && item.link) {
                  return (
                    <span className="m-0">
                      <a
                        href={item.link} key={item.name} className="w-full"
                        target="_blank" rel="noopener noreferrer"
                      >
                        {icons.has(item.name) ? icons.get(item.name) : null}
                        <p className="inline align-middle m-0 ml-2">
                          {item.name}
                        </p>
                      </a>
                    </span>
                  )
                }
              })}
            </div>
          </div>
          <div className="flex flex-col basis-1/2 justify-center md:order-first">
            <span className="w-4/5 mb-4">
              <PwnyBanner />
            </span>
          </div>
        </div>
        <p>
          &copy; {new Date().getFullYear()} SIGPwny. ACM@UIUC is a 501(c)(3) non-profit organization.
        </p>
      </div>
    </footer>
  )
}

export default Footer