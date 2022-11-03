const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

// create pages for each markdown file in content/meetings
// exports.createPages = async ({ graphql, actions }) => {
//   const { createPage } = actions
//   const result = await graphql(`
//     query {
//       allMarkdownRemark {
//         edges {
//           node {
//             id
//             frontmatter {
//               path
//             }
//           }
//         }
//       }
//     }
//   `)

//   if (result.errors) {
//     throw result.errors
//   }

//   // create page for each markdown file in content/meetings
//   result.data.allMarkdownRemark.edges.forEach(({ node }) => {
//     createPage({
//       path: node.frontmatter.path,
//       component: path.resolve(`./src/templates/meeting.js`),
//       context: {
//         id: node.id,
//       },
//     })
//   })
// }

// exports.createSchemaCustomization = ({ actions }) => {
//   const { createTypes } = actions

//   createTypes(`
//     type Mdx implements Node {
//       frontmatter: MdxFrontmatter!
//     }
//     type MdxFrontmatter {
//       heroImageOne: File @fileByRelativePath
//       heroImageTwo: File @fileByRelativePath
//       heroImageThree: File @fileByRelativePath
//     }
//   `)
// }

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Define a template
  const meeting_template = path.resolve(`./src/components/MeetingTemplate.tsx`)

  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: ASC }
           limit: 1000
        ) {
          nodes {
            id
            parent {
              ... on File {
                relativePath
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading meetings from GraphQL: ${result.errors}`
    )
    return
  }

  const meetings = result.data.allMarkdownRemark.nodes

  // `context` is available in the template as a prop and as a variable in GraphQL

  if (meetings.length > 0) {
    // Generate pages for each meeting
    meetings.forEach((meeting, index) => {
      const previousMeetingId = index === 0 ? null : meetings[index - 1].id
      const nextMeetingId = index === meetings.length - 1 ? null : meetings[index + 1].id

      createPage({
        path: path.parse(meeting.parent.relativePath).dir,
        component: meeting_template,
        context: {
          id: meeting.id,
          previousMeetingId,
          nextMeetingId,
        },
      })
    })
  }
}

// exports.createSchemaCustomization = ({ actions }) => {
//   const { createTypes } = actions

//   // Explicitly define the siteMetadata {} object
//   // This way those will always be defined even if removed from gatsby-config.js

//   createTypes(`
//     type MarkdownRemark implements Node {
//       timeToRead: String
//       frontmatter: Frontmatter
//     }
//     type Frontmatter {
//       title: String
//     }
//   `)
// }