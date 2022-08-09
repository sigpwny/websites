import type { GatsbyNode } from "gatsby"
// type Person = {
//   id: number
//   name: string
//   age: number
// }
// export const sourceNodes: GatsbyNode["sourceNodes"] = async ({
//   actions,
//   createNodeId,
//   createContentDigest,
// }) => {
//   const { createNode } = actions
//   const data = await getSomeData()
//   data.forEach((person: Person) => {
//     const node = {
//       ...person,
//       parent: null,
//       children: [],
//       id: createNodeId(`person__${person.id}`),
//       internal: {
//         type: "Person",
//         content: JSON.stringify(person),
//         contentDigest: createContentDigest(person),
//       },
//     }
//     createNode(node)
//   })
// }

// define a type for graphql() result

// create nodes based on markdown files in the contents/meetings folder
export const createPages: GatsbyNode["createPages"] = async ({
  actions,
  graphql,
}) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/contents/meetings/" } }
      ) {
        edges {
          node {
            frontmatter {
              title
              date
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  if (result.errors) {
    throw result.errors
  }
  const meetings = result.data.allMarkdownRemark.edges
  meetings.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: require.resolve("./src/templates/meeting.tsx"),
      context: {
        slug: node.fields.slug,
        title: node.frontmatter.title,
        date: node.frontmatter.date,
      },
    })
  }
  )
}

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = ({
  actions,
}) => {
  const { createTypes } = actions
  createTypes(`
    type Meeting implements Node {
      title: String!
      date: Date @dateformat
      image: String!
    }
  `)
}