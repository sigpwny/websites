import React, { useState, useEffect } from "react"
import { graphql, useStaticQuery } from "gatsby"
import { useMediaQuery } from 'react-responsive'

type Helper = Queries.HelperProfilesQuery["allHelper"]["helpers"][0]

const HelperProfiles = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const [isHidden, setIsHidden] = useState(true)
  useEffect(() => {
    setIsHidden(isMobile)
  }, [isMobile])
  const toggleHidden = () => {
    setIsHidden(!isHidden)
  }

  const data: Queries.HelperProfilesQuery = useStaticQuery(graphql`
    query HelperProfiles {
      allHelper(sort: [{weight: ASC}, {name: ASC}]) {
        helpers: nodes {
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
          weight
          links {
            name
            link
          }
        }
      }
    }
  `)
  return (
    <>
      {data.allHelper.helpers.length > 0 ? (
        <section id="helpers" className="pb-8">
          <div className="flex flex-row justify-between justify-center">
            <h1>Helpers</h1>
            <div>
              <button className={`border-2 rounded-lg px-2 ${isHidden ? 'bg-white text-black' : 'border-white'}`} onClick={toggleHidden}>{isHidden ? 'Show' : 'Hide'}</button>
            </div>
          </div>
          <div className="grid 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-2 gap-8">
            {!isHidden && data.allHelper.helpers.map((helper: Helper) => (
              <div className="card h-100">
                <div className="p-2">
                  <div className="flex flex-row justify-center m-2 gap-4">
                    <div className="basis-1/3">
                      <img className="rounded-full" src={helper.image.path.childImageSharp?.gatsbyImageData.images.fallback?.src} />
                    </div>
                    <div className="basis-2/3 self-center">
                      {helper.role ? (
                        <p className="font-mono font-bold text-primary uppercase m-0">
                          {helper.role}
                        </p>
                      ) : null}
                      <p className="text-2xl font-bold m-0">{helper.name}</p>
                      {helper.handle ? (
                        <p className="font-mono">
                          @{helper.handle}
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

export default HelperProfiles