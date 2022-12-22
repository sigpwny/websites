const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

import { calculateSemester } from "./src/utils/utils"

exports.onCreateNode = ({ node, actions, getNode, createNodeId, createContentDigest }) => {
  const { createNode } = actions
  // Transform MarkdownRemark nodes into nodes corresponding to content types
  if (node.internal.type === "MarkdownRemark") {
    const fileNode = getNode(node.parent)
    // Meeting nodes
    if (fileNode.sourceInstanceName === "meetings") {
      // Validate required fields
      const requiredFields = ["date", "week_number", "title", "credit", "image"]
      for (const field of requiredFields) {
        if (node.frontmatter[field] === undefined) {
          throw new Error(`"${field}" is required for ${fileNode.absolutePath}`)
        }
      }
      if (node.frontmatter.image.path === undefined ||
          node.frontmatter.image.alt === undefined) {
        throw new Error(`"image.path" and "image.alt" are required for ${fileNode.absolutePath}`)
      }
      // Validate calculated semester matches directory name
      const semester = calculateSemester(new Date(node.frontmatter.date))
      const filePathSemester = fileNode.relativePath.split("/")[0]
      if (semester != filePathSemester) {
        console.warn(`Semester "${semester}" does not match directory "${filePathSemester}}" for ${fileNode.absolutePath}`)
      }
      // Create slug
      const slug = "/meetings/" + path.parse(fileNode.relativePath).dir + "/"
      // Create node
      createNode({
        id: createNodeId(`Meeting-${node.id}`),
        parent: node.id,
        children: [],
        internal: {
          type: 'Meeting',
          content: JSON.stringify(node),
          contentDigest: createContentDigest(node),
        },
        date: node.frontmatter.date,
        week_number: node.frontmatter.week_number,
        title: node.frontmatter.title,
        credit: node.frontmatter.credit,
        featured: node.frontmatter.featured || false,
        image: node.frontmatter.image,
        slides: node.frontmatter.slides || null,
        recording: node.frontmatter.recording || null,
        assets: node.frontmatter.assets || null,
        tags: node.frontmatter.tags || null,
        semester,
        slug,
      })
    // Event nodes
    } else if (fileNode.sourceInstanceName === "events") {
      // TODO
    }
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
    type MarkdownRemark implements Node {
      html: String!
    }

    type Meeting implements Node @dontInfer {
      date: Date! @dateformat
      week_number: Int!
      title: String!
      credit: String!
      featured: Boolean
      image: ImageAlt!
      slides: File @fileByRelativePath
      recording: String
      assets: [File] @fileByRelativePath
      tags: [String]
      semester: String!
      slug: String!
    }

    type ImageAlt @dontInfer {
      path: File! @fileByRelativePath
      alt: String!
    }
  `)
}

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    Site: {
      siteMetadata: {
        resolve: (source, args, context, info) => {
          // Customize the data that is returned for the siteMetadata field here.
          // You can access the original site metadata by calling source.siteMetadata.
          // The context object contains information about the current GraphQL request,
          // and the info object contains information about the field being queried.
          // You can return any data that you want to be included in the siteMetadata field.
          return {
            title: source.siteMetadata.title || "SIGPwny",
            siteUrl: source.siteMetadata.siteUrl || "https://sigpwny.com",
            description: source.siteMetadata.description || "",
            navLinks: source.siteMetadata.navLinks || [],
            navCallToActionLinks: source.siteMetadata.navCallToActionLinks || [],
            socialLinks: source.siteMetadata.socialLinks || [],
          }
        },
      },
    },
  }
  createResolvers(resolvers)
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // const result = await graphql(`
  //   {
  //     allMarkdownRemark(
  //       sort: { fields: [frontmatter___date], order: ASC }
  //     ) {
  //       nodes {
  //         id
  //         parent {
  //           ... on File {
  //             sourceInstanceName
  //             relativePath
  //           }
  //         }
  //       }
  //     }
  //   }
  // `)

  const result = await graphql(`
    {
      allMeeting(sort: { fields: [date], order: ASC }) {
        meetings: nodes {
          id
          slug
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const meeting_template = path.resolve(`./src/templates/MeetingTemplate.tsx`)
  const event_template = path.resolve(`./src/templates/EventTemplate.tsx`)
  const redirect_template = path.resolve(`./src/templates/RedirectTemplate.tsx`)

  const meetings = result.data.allMeeting.meetings
  if (meetings.length > 0) {
    meetings.forEach((meeting, index) => {
      const prev_id = index === meetings.length - 1 ? null : meetings[index + 1].id
      const next_id = index === 0 ? null : meetings[index - 1].id
      createPage({
        path: meeting.slug,
        component: meeting_template,
        context: {
          id: meeting.id,
          prev_id,
          next_id,
        },
        trailingSlash: true,
      })
    })
  }

  // const nodes = result.data.allMarkdownRemark.nodes

  // Define content types for each markdown file, based on gatsby-source-filesystem name
  // const meetings = nodes.filter(node => node.parent.sourceInstanceName === "meetings")
  // var meetings: any[] = []
  // var events: any[] = []
  // var redirects: any[] = []
  // var admins: any[] = []
  // var alumni: any[] = []

  // // Sort nodes into content types
  // nodes.forEach(node => {
  //   switch (node.parent.sourceInstanceName) {
  //     case "meetings":
  //       meetings.push(node)
  //       break
  //     case "events":
  //       events.push(node)
  //       break
  //     case "redirects":
  //       redirects.push(node)
  //       break
  //     case "admins":
  //       admins.push(node)
  //       break
  //     case "alumni":
  //       alumni.push(node)
  //       break
  //     default:
  //       console.warn("markdown file not in a recognized directory:" + node.parent.sourceInstanceName + ", " + node.parent.relativePath)
  //       break
  //   }
  // })

  // // Define templates
  // const meeting_template = path.resolve(`./src/templates/MeetingTemplate.tsx`)
  // const event_template = path.resolve(`./src/templates/EventTemplate.tsx`)
  // const redirect_template = path.resolve(`./src/templates/RedirectTemplate.tsx`)

  // // Create meeting pages
  // if (meetings.length > 0) {
  //   meetings.forEach((node, index) => {
  //     const prev_id = index === 0 ? null : meetings[index - 1].id
  //     const next_id = index === meetings.length - 1 ? null : meetings[index + 1].id
  //     const slug = node.parent.sourceInstanceName + "/" + path.parse(node.parent.relativePath).dir
  //     console.log(slug)
  //     createPage({
  //       path: slug,
  //       component: meeting_template,
  //       context: {
  //         id: node.id,
  //         prev_id,
  //         next_id,
  //       },
  //     })
  //   })
  // }

  // // Create event pages
  // if (events.length > 0) {
  //   events.forEach(node => {
  //     createPage({
  //       path: path.parse(node.parent.relativePath).dir,
  //       component: event_template,
  //       context: {
  //         id: node.id
  //       },
  //     })
  //   })
  // }

  // // Create redirect pages
  // if (redirects.length > 0) {
  //   redirects.forEach(node => {
  //     createPage({
  //       path: path.parse(node.parent.relativePath).dir,
  //       component: redirect_template,
  //       context: {
  //         id: node.id
  //       },
  //     })
  //   })
  // }
}