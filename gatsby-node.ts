const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

import { calculateSemester } from "./src/utils/util"

exports.onCreateNode = ({ node, actions, getNode, createNodeId, createContentDigest }) => {
  const { createNode, createNodeField } = actions
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
        location: node.frontmatter.location || null,
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
      // Validate required fields
      const requiredFields = ["title", "series", "description", "time_start", "image"]
      for (const field of requiredFields) {
        if (node.frontmatter[field] === undefined) {
          throw new Error(`"${field}" is required for ${fileNode.absolutePath}`)
        }
      }
      if (node.frontmatter.image.path === undefined ||
          node.frontmatter.image.alt === undefined) {
        throw new Error(`"image.path" and "image.alt" are required for ${fileNode.absolutePath}`)
      }
      const slug = "/events/" + path.parse(fileNode.relativePath).dir + "/"
      createNode({
        id: createNodeId(`Event-${node.id}`),
        parent: node.id,
        children: [],
        internal: {
          type: 'Event',
          content: JSON.stringify(node),
          contentDigest: createContentDigest(node),
        },
        title: node.frontmatter.title,
        series: node.frontmatter.series.toLowerCase(),
        description: node.frontmatter.description,
        time_start: node.frontmatter.time_start,
        time_close: node.frontmatter.time_close || null,
        image: node.frontmatter.image,
        links: node.frontmatter.links || null,
        rating_weight: node.frontmatter.rating_weight || null,
        stats: node.frontmatter.stats || null,
        slug,
      })
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
  // Mdx support
  } else if (node.internal.type === "Mdx") {
    const fileNode = getNode(node.parent)
    // PageMarkdown nodes
    if (fileNode.sourceInstanceName === "pages") {
      // Validate required fields
      const requiredFields = ["title"]
      for (const field of requiredFields) {
        if (node.frontmatter[field] === undefined) {
          throw new Error(`"${field}" is required for ${fileNode.absolutePath}`)
        }
      }
      let slug
      if (node.frontmatter.slug) {
        slug = node.frontmatter.slug
      } else {
        const parsedPath = path.parse(fileNode.relativePath)
        if (parsedPath.name === "index") {
          slug = "/" + parsedPath.dir + "/"
        } else {
          slug = "/" + path.join(parsedPath.dir, parsedPath.name)
        }
      }
      console.log(slug)
      createNodeField({
        node,
        name: "slug",
        value: slug,
      })
      createNode({
        id: createNodeId(`PageMarkdown-${node.id}`),
        parent: node.id,
        children: [],
        internal: {
          type: 'PageMarkdown',
          content: JSON.stringify(node),
          contentDigest: createContentDigest(node),
        },
        contentFilePath: node.internal.contentFilePath,
        title: node.frontmatter.title,
        slug,
      })
    }
  }
}
// Possible code golf:
// const contentTypes = {
//   Meeting: {
//     requiredFields: ["date", "week_number", "title", "credit", "image"],
//     fields: ["date", "week_number", "title", "credit", "featured", "location", "image", "slides", "recording", "assets", "tags", "semester", "slug"]
//   },
//   Event: {
//     requiredFields: ["title", "series", "description", "time_start", "image"],
//     fields: ["title", "series", "description", "time_start", "time_close", "image", "links", "rating_weight", "stats", "slug"]
//   },
//   // Add more content types here
// }

// exports.onCreateNode = ({ node, actions, getNode, createNodeId, createContentDigest }) => {
//   const { createNode } = actions
//   if (node.internal.type !== "MarkdownRemark") return

//   const fileNode = getNode(node.parent)
//   const sourceInstanceName = fileNode.sourceInstanceName
//   const contentType = Object.keys(contentTypes).find(type => type.toLowerCase() === sourceInstanceName)
//   if (!contentType) return

//   const { requiredFields, fields } = contentTypes[contentType]
//   requiredFields.forEach(field => {
//     if (node.frontmatter[field] === undefined) {
//       throw new Error(`"${field}" is required for ${fileNode.absolutePath}`)
//     }
//   })

//   if (node.frontmatter.image.path === undefined || node.frontmatter.image.alt === undefined) {
//     throw new Error(`"image.path" and "image.alt" are required for ${fileNode.absolutePath}`)
//   }

//   let slug, semester
//   if (contentType === "Meeting") {
//     semester = calculateSemester(new Date(node.frontmatter.date))
//     const filePathSemester = fileNode.relativePath.split("/")[0]
//     if (semester != filePathSemester) {
//       console.warn(`Semester "${semester}" does not match directory "${filePathSemester}}" for ${fileNode.absolutePath}`)
//     }
//     slug = `/meetings/${path.parse(fileNode.relativePath).dir}/`
//   } else if (contentType === "Event") {
//     slug = `/events/${path.parse(fileNode.relativePath).dir}/`
//   }
//   // Add more content types here

//   createNode({
//     id: createNodeId(`${contentType}-${node.id}`),
//     parent: node.id,
//     children: [],
//     internal: {
//       type: contentType,
//       content: JSON.stringify(node),
//       contentDigest: createContentDigest(node),
//     },
//     ...fields.reduce((obj, field) => {
//       obj[field] = node.frontmatter[field] || null
//       return obj
//     }, {}),
//     semester,
//     slug,
//   })
// }

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
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
      ctftime: String
    }

    type Stats {
      participation: Int
      teams: Int
      solves: Int
    }

    type Meeting implements Node @dontInfer {
      date: Date! @dateformat
      week_number: Int!
      title: String!
      credit: [String!]!
      featured: Boolean
      location: String
      image: ImageAlt!
      slides: File @fileByRelativePath
      recording: String
      assets: [File] @fileByRelativePath
      tags: [String]
      semester: String!
      slug: String!
    }

    type Event implements Node @dontInfer {
      title: String!
      series: String!
      description: String!
      time_start: Date! @dateformat
      time_close: Date @dateformat
      location: String
      image: ImageAlt!
      links: Links
      rating_weight: Float
      stats: Stats
      slug: String!
    }

    type PageMarkdown implements Node @dontInfer {
      contentFilePath: String!
      title: String!
      slug: String!
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
      allEvent(sort: {time_start: ASC}) {
        events: nodes {
          id
          slug
        }
      }
      allPageMarkdown {
        pages_md: nodes {
          id
          slug
          parent {
            internal {
              contentFilePath
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const template_meeting = path.resolve(`./src/templates/template-meeting.tsx`)
  const template_event = path.resolve(`./src/templates/template-event.tsx`)
  const template_page_md = path.resolve(`./src/templates/template-page_md.tsx`)
  const template_redirect = path.resolve(`./src/templates/template-redirect.tsx`)

  const meetings = result.data.allMeeting.meetings
  if (meetings.length > 0) {
    meetings.forEach((meeting, index) => {
      const prev_id = index === meetings.length - 1 ? null : meetings[index + 1].id
      const next_id = index === 0 ? null : meetings[index - 1].id
      createPage({
        path: meeting.slug,
        component: template_meeting,
        context: {
          id: meeting.id,
          prev_id,
          next_id,
        },
        trailingSlash: true,
      })
    })
  }

  const events = result.data.allEvent.events
  if (events.length > 0) {
    events.forEach((event_) => {
      createPage({
        path: event_.slug,
        component: template_event,
        context: {
          id: event_.id,
        },
        trailingSlash: true,
      })
    })
  }

  const pages_md = result.data.allPageMarkdown.pages_md
  if (pages_md.length > 0) {
    pages_md.forEach((page_md) => {
      createPage({
        path: page_md.slug,
        component: `${template_page_md}?__contentFilePath=${page_md.parent.internal.contentFilePath}`,
        context: {
          id: page_md.id,
        },
        trailingSlash: true,
      })
    })
  }
}