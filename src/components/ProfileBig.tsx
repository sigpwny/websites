import React from "react"
import { Link, useStaticQuery, graphql, navigate } from "gatsby"
import { IGatsbyImageData } from "gatsby-plugin-image"

interface ProfileBigType {
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

// const ProfileBig = ({ big_props }: ProfileBigType) => {
//   return (
//     <>
//     const meetings: MdxQuery = useStaticQuery(graphql`
//     query {
//       allProfiles: allMarkdownRemark(
//         filter: {fileAbsolutePath: {glob: "**/profiles/admin/**"}, frontmatter: {featured: {eq: true}}}
//         sort: {fields: frontmatter___date, order: DESC}
//       ) {
//         meetings: nodes {
//           fileAbsolutePath
//           parent {
//             ... on File {
//               sourceInstanceName
//             }
//           }
//           frontmatter {
//             title
//             credit
//             date(formatString: "YYYY-MM-DD")
//             image {
//               path {
//                 childImageSharp {
//                   gatsbyImageData(width: 500, quality: 100)
//                 }
//               }
//               alt
//             }
//           }
//         }
//       }
//     }
//   `)
//     </>
//   )
// }

// export default ProfileBig