const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

import { calculateSemester } from "./src/utils/util"

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
      const slug = "/meetings/" + path.parse(fileNode.relativePath).dir + "/"
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
    // Admin nodes
    } else if (fileNode.sourceInstanceName === "admins") {
      // Validate required fields
      const requiredFields = ["name", "image", "role", "weight", "bio"]
      for (const field of requiredFields) {
        if (node.frontmatter[field] === undefined) {
          throw new Error(`"${field}" is required for ${fileNode.absolutePath}`)
        }
      }
      if (node.frontmatter.image.path === undefined ||
          node.frontmatter.image.alt === undefined) {
        throw new Error(`"image.path" and "image.alt" are required for ${fileNode.absolutePath}`)
      }
      createNode({
        id: createNodeId(`Admin-${node.id}`),
        parent: node.id,
        children: [],
        internal: {
          type: 'Admin',
          content: JSON.stringify(node),
          contentDigest: createContentDigest(node),
        },
        name: node.frontmatter.name,
        bio: node.frontmatter.bio,
        image: node.frontmatter.image,
        handle: node.frontmatter.handle || null,
        role: node.frontmatter.role,
        weight: node.frontmatter.weight,
        links: node.frontmatter.links || null,
      })
    // Alum nodes
    } else if (fileNode.sourceInstanceName === "alumni") {
      // Validate required fields
      const requiredFields = ["name", "image", "role", "weight"]
      for (const field of requiredFields) {
        if (node.frontmatter[field] === undefined) {
          throw new Error(`"${field}" is required for ${fileNode.absolutePath}`)
        }
      }
      if (node.frontmatter.image.path === undefined ||
          node.frontmatter.image.alt === undefined) {
        throw new Error(`"image.path" and "image.alt" are required for ${fileNode.absolutePath}`)
      }
      createNode({
        id: createNodeId(`Alum-${node.id}`),
        parent: node.id,
        children: [],
        internal: {
          type: 'Alum',
          content: JSON.stringify(node),
          contentDigest: createContentDigest(node),
        },
        name: node.frontmatter.name,
        image: node.frontmatter.image,
        handle: node.frontmatter.handle || null,
        role: node.frontmatter.role,
        period: node.frontmatter.period || null,
        work: node.frontmatter.work || null,
        weight: node.frontmatter.weight,
        links: node.frontmatter.links || null,
      })
    // Helper nodes
    } else if (fileNode.sourceInstanceName === "helpers") {
      // Validate required fields
      const requiredFields = ["name", "image", "role", "weight"]
      for (const field of requiredFields) {
        if (node.frontmatter[field] === undefined) {
          throw new Error(`"${field}" is required for ${fileNode.absolutePath}`)
        }
      }
      if (node.frontmatter.image.path === undefined ||
          node.frontmatter.image.alt === undefined) {
        throw new Error(`"image.path" and "image.alt" are required for ${fileNode.absolutePath}`)
      }
      createNode({
        id: createNodeId(`Helper-${node.id}`),
        parent: node.id,
        children: [],
        internal: {
          type: 'Helper',
          content: JSON.stringify(node),
          contentDigest: createContentDigest(node),
        },
        name: node.frontmatter.name,
        image: node.frontmatter.image,
        handle: node.frontmatter.handle || null,
        role: node.frontmatter.role,
        weight: node.frontmatter.weight,
        links: node.frontmatter.links || null,
      })
    }
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
    type Meeting implements Node @dontInfer {
      date: Date! @dateformat
      week_number: Int!
      title: String!
      credit: [String!]!
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

    type Links {
      email: String
      website: String
      github: String
      twitter: String
      mastodon: String
      linkedin: String
      discord: String
    }

    type Admin implements Node {
      name: String!
      bio: String!
      image: ImageAlt!
      handle: String
      role: String!
      weight: Int!
      links: Links
    }

    type Alum implements Node {
      name: String!
      image: ImageAlt!
      handle: String
      role: String!
      period: String
      work: String
      weight: Int!
      links: Links
    }

    type Helper implements Node {
      name: String!
      image: ImageAlt!
      handle: String
      role: String!
      weight: Int!
      links: Links
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

  const result = await graphql(`
    query GatsbyNode {
      allMeeting(sort: {date: ASC}) {
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
}