import React from "react"
import { graphql, useStaticQuery } from "gatsby"

type Alum = Queries.AlumProfilesQuery["allAlum"]["alumni"][0]

const AlumProfiles = () => {
  const data: Queries.AlumProfilesQuery = useStaticQuery(graphql`
    query AlumProfiles {
      allAlum(sort: [{weight: ASC}, {name: ASC}]) {
        alumni: nodes {
          name
          image {
            path {
              childImageSharp {
                gatsbyImageData(width: 300, quality: 100)
              }
            }
            alt
          }
          handle
          role
          period
          work
          weight
          links {
            email
            website
            github
            twitter
            mastodon
            linkedin
            discord
          }
        }
      }
    }
  `)
  return (
    <>
      {data.allAlum.alumni.length > 0 ? (
        <section id="alumni" className="pb-8">
          <h1>Alumni & Elders</h1>
          <div className="grid 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-2 gap-8">
            {data.allAlum.alumni.map((alum: Alum) => (
              <div className="card h-100">
                <div className="p-2">
                  <div className="flex flex-row justify-center m-2 gap-4">
                    <div className="basis-1/3">
                      <img className="rounded-full" src={alum.image.path.childImageSharp?.gatsbyImageData.images.fallback?.src} />
                    </div>
                    <div className="basis-2/3 self-center">
                    {alum.role ? (
                        <p className="font-mono font-bold text-primary uppercase m-0">
                          {alum.role}
                        </p>
                      ) : null}
                      <p className="text-3xl font-bold m-0">{alum.name}</p>
                      {alum.handle ? (
                        <p className="font-mono">
                          @{alum.handle}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}

export default AlumProfiles