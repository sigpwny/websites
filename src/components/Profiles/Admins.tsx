import React, { useState } from "react"
import { graphql, useStaticQuery } from "gatsby"

type Admin = Queries.AdminProfilesQuery["allAdmin"]["admins"][0]

const AdminProfiles = () => {
  const [isHidden, setIsHidden] = useState(false)
  const data: Queries.AdminProfilesQuery = useStaticQuery(graphql`
    query AdminProfiles {
      allAdmin(sort: [{weight: DESC}, {name: ASC}]) {
        admins: nodes {
          name
          bio
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
      {data.allAdmin.admins.length > 0 ? (
        <section id="admins" className="pb-8">
          <div className="flex flex-row justify-between justify-center">
            <h1>Admin Team</h1>
            <div>
              <button className={`border-2 rounded-lg px-2 ${isHidden ? 'bg-white text-black' : 'border-white'}`} onClick={() => setIsHidden(!isHidden)}>{isHidden ? 'Show' : 'Hide'}</button>
            </div>
          </div>
          <div className="grid 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-2 gap-8">
            {!isHidden && data.allAdmin.admins.map((admin: Admin) => (
              <div className="card h-100">
                <div className="p-2">
                  <div className="flex flex-row justify-center m-2 gap-4">
                    <div className="basis-1/3">
                      <img className="rounded-full" src={admin.image.path.childImageSharp?.gatsbyImageData.images.fallback?.src} />
                    </div>
                    <div className="basis-2/3 self-center">
                      {admin.role ? (
                        <p className="font-mono font-bold text-primary uppercase m-0">
                          {admin.role}
                        </p>
                      ) : null}
                      <p className="text-2xl font-bold m-0">{admin.name}</p>
                      {admin.handle ? (
                        <p className="font-mono">
                          @{admin.handle}
                        </p>
                      ) : null}
                      <p>{admin.bio}</p>
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

export default AdminProfiles