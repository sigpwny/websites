import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { StaticImage, IGatsbyImageData } from "gatsby-plugin-image"

interface ProfileSmall {
  name: string
  image: {
    path: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
    }
    alt: string
  }
  handle?: string
  period?: string
  history?: string
  work?: string
  weight: number
  links?: {
    email?: string
    website?: string
    github?: string
    twitter?: string
    linkedin?: string
    discord?: string
  }
}

interface ProfileSmallNode {
  fileAbsolutePath: string
  parent: {
    sourceInstanceName: string
  }
  frontmatter: ProfileSmall
}

interface ProfileBig {
  name: string
  bio: string
  image: {
    path: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
    }
    alt: string
  }
  handle?: string
  role?: string
  weight: number
  links?: {
    email?: string
    website?: string
    github?: string
    twitter?: string
    linkedin?: string
    discord?: string
  }
}

interface ProfileBigNode {
  fileAbsolutePath: string
  parent: {
    sourceInstanceName: string
  }
  frontmatter: ProfileBig
}

interface ProfilesQuery {
  allProfiles: {
    admins: ProfileBigNode[]
    alumni: ProfileSmallNode[]
    // helpers: ProfileSmallNode[]
  }
}

// interface HelpersQuery {
//   allHelpers: {
//     helpers: ProfileSmallNode[]
//   }
// }

export function Head() {
  return (
    <>
      <title>About</title>
    </>
  )
}

const AboutPage = () => {
  const profilesQuery: ProfilesQuery = useStaticQuery(graphql`
    query {
      allProfiles: allMarkdownRemark(
        filter: {fileAbsolutePath: {glob: "**/profiles/admins/**"}}
        sort: {
          fields: [frontmatter___weight, frontmatter___name],
          order: [ASC, ASC]
        }
      ) {
        admins: nodes {
          fileAbsolutePath
          parent {
            ... on File {
              sourceInstanceName
            }
          }
          frontmatter {
            name
            bio
            image {
              path {
                childImageSharp {
                  gatsbyImageData(width: 500, quality: 100)
                }
              }
              alt
            }
            handle
            role
            weight
            links {
              email
              website
              github
              twitter
              linkedin
              discord
            }
          }
        }
        alumni: nodes {
          fileAbsolutePath
          parent {
            ... on File {
              sourceInstanceName
            }
          }
          frontmatter {
            name
            image {
              path {
                childImageSharp {
                  gatsbyImageData(width: 500, quality: 100)
                }
              }
              alt
            }
            handle
            period
            history
            work
            weight
            links {
              email
              website
              github
              twitter
              linkedin
              discord
            }
          }
        }
      }
    }
  `)

  return (
    <>
      <section id="acronym" className="py-8">
        <div className="flex flex-col">
          <div className="flex flex-row justify-center pb-6">
            <div className="flex flex-col">
              <p className="use-color-primary font-bold text-right text-5xl sm:text-6xl md:text-7xl lg:text-8xl">SIG</p>
              <p className="text-center">&#8595;</p>
              <p className="font-bold text-center">Special <br />Interest <br />Group</p>
            </div>
            <div className="flex flex-col">
              <p className="use-color-primary font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl">&nbsp;&bull;&nbsp;Pwn&nbsp;&bull;&nbsp;</p>
              <p className="text-center">&#8595;</p>
              <p className="font-bold text-center">To hack <br />or "own" <br />(slang)</p>
            </div>
            <div className="flex flex-col">
              <p className="use-color-primary font-bold text-left text-5xl sm:text-6xl md:text-7xl lg:text-8xl">y</p>
              <p className="text-center">&#8595;</p>
              <p className="font-bold text-center">For <br />cool <br />logo</p>
            </div>
          </div>
          <div className="flex flex-row justify-center">
            <p>sig-<b>poh</b>-nee</p>
            <p>&nbsp;<small>[audio]</small></p>
          </div>
        </div>
      </section>

      <section id="text-info" className="pb-8">
        <h1>What We Do</h1>
        <h1>What We Don't Do</h1>
      </section>

      <section id="text-info" className="pb-8">
        <h1>Our Values</h1>
        <ul>
          <li>Education</li>
          <li>Inclusion</li>
          <li>Competition (Collaboration)</li>
        </ul>
      </section>

      {/* <section id="opportunities" className="pb-8">
        <h1>Opportunities</h1>
        <h2>Research</h2>
        <h2>CTF Events</h2>
        <h2>Helper Team</h2>
      </section> */}

      <section id="admins" className="pb-8">
        <h1>Admin Team</h1>
        <div className="grid 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-2 gap-8">
          {profilesQuery.allProfiles.admins.map((admin: ProfileBigNode) => (
            <div className="card h-100">
              <div className="p-2">
                <div className="flex flex-row justify-center m-2 gap-4">
                  <div className="basis-1/3">
                    <img className="rounded-full" src={admin.frontmatter.image.path.childImageSharp.gatsbyImageData.images.fallback?.src} />
                  </div>
                  <div className="basis-2/3 self-center">
                    {admin.frontmatter.role && <p className="font-mono font-bold text-primary uppercase m-0">{admin.frontmatter.role}</p>}
                    <p className="text-3xl font-bold m-0">{admin.frontmatter.name}</p>
                    {admin.frontmatter.handle && <p className="font-mono">@{admin.frontmatter.handle}</p>}
                    <p>{admin.frontmatter.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="helpers" className="pb-8">
        <h1>Helper Team</h1>
      </section>

      <section id="alumni" className="pb-8">
        <h1>Alumni</h1>
      </section>
    </>
  )
}

export default AboutPage