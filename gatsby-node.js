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