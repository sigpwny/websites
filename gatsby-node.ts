const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

import { calculateSemester } from "./src/utils/util"

const contentTypes = {
  // MarkdownRemark
  "meetings": {
    typename: "Meeting",
    requiredFields: ["title", "time_start", "week_number", "credit"],
    fields: ["title", "time_start", "time_close", "week_number", "credit", "featured", "location", "image", "slides", "recording", "assets", "tags", "semester", "slug"]
  },
  "events": {
    typename: "Event",
    requiredFields: ["title", "series", "description", "time_start", "image"],
    fields: ["title", "series", "description", "time_start", "time_close", "location", "image", "links", "rating_weight", "stats", "slug"]
  },
  "admins": {
    typename: "Admin",
    requiredFields: ["name", "image", "role", "weight", "bio"],
    fields: ["name", "bio", "image", "handle", "role", "weight", "links"]
  },
  "alumni": {
    typename: "Alum",
    requiredFields: ["name", "image", "role", "weight"],
    fields: ["name", "image", "handle", "role", "period", "work", "weight", "links"]
  },
  "helpers": {
    typename: "Helper",
    requiredFields: ["name", "image", "role", "weight"],
    fields: ["name", "image", "handle", "role", "weight", "links"]
  },
  // Mdx
  "pages_md": {
    typename: "PageMarkdown",
    requiredFields: ["title"],
    fields: ["title", "no_background", "slug"]
  },
}

exports.onCreateNode = ({ node, actions, getNode, createNodeId, createContentDigest }) => {
  const { createNode } = actions
  if (node.internal.type === "MarkdownRemark" || node.internal.type === "Mdx") {

    const fileNode = getNode(node.parent)
    const sourceInstanceName = fileNode.sourceInstanceName
    const contentType = Object.keys(contentTypes).find(source => source === sourceInstanceName)
    if (!contentType) return

    const { typename, requiredFields, fields } = contentTypes[contentType]
    for (const field of requiredFields) {
      if (node.frontmatter[field] === null ||
          node.frontmatter[field] === undefined ||
          node.frontmatter[field] === "") {
        throw new Error(`"${field}" is required for ${fileNode.absolutePath}`)
      }
    }

    if ("image" in requiredFields) {
      if (node.frontmatter.image.path === null ||
          node.frontmatter.image.path === undefined ||
          node.frontmatter.image.path === "" ||
          node.frontmatter.image.alt === null ||
          node.frontmatter.image.alt === undefined ||
          node.frontmatter.image.alt === "") {
        throw new Error(`"image.path" and "image.alt" are required for ${fileNode.absolutePath}`)
      }
    }

    let slug, semester
    if (node.internal.type === "MarkdownRemark") {
      if (typename === "Meeting") {
        semester = calculateSemester(node.frontmatter.time_start)
        const filePathSemester = fileNode.relativePath.split("/")[0]
        if (semester.toLowerCase() != filePathSemester.toLowerCase()) {
          console.warn(`Semester "${semester}" does not match directory "${filePathSemester}" for ${fileNode.absolutePath}`)
        }
        slug = `/meetings/${path.parse(fileNode.relativePath).dir}/`
      } else if (typename === "Event") {
        slug = `/events/${path.parse(fileNode.relativePath).dir}/`
      }
    } else if (node.internal.type === "Mdx") {
      if (typename === "PageMarkdown") {
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
      }
    }

    createNode({
      id: createNodeId(`${typename}-${node.id}`),
      parent: node.id,
      children: [],
      internal: {
        type: typename,
        content: JSON.stringify(node),
        contentDigest: createContentDigest(node),
      },
      ...fields.reduce((obj, field) => {
        obj[field] = node.frontmatter[field]
        return obj
      }, {}),
      semester,
      slug,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
    type Site implements Node {
      siteMetadata: SiteMetadata!
    }

    type SiteMetadata {
      title: String!
      siteUrl: String!
      description: String!
      image: String!
      navLinks: [NavLink]
      navCallToActionLinks: [NavLink]
      socialLinks: [NavLink]
      timezone: String!
    }
    
    type NavLink {
      name: String!
      link: String!
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
      ctftime: String
    }

    type Stats {
      participants: Int
      teams: Int
      solves: Int
    }

    type Meeting implements Node @dontInfer {
      title: String!
      time_start: Date! @dateformat
      time_close: Date @dateformat
      week_number: Int!
      credit: [String!]!
      featured: Boolean
      location: String
      image: ImageAlt
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
      title: String!
      no_background: Boolean
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
            image: source.siteMetadata.image || "",
            navLinks: source.siteMetadata.navLinks || [],
            navCallToActionLinks: source.siteMetadata.navCallToActionLinks || [],
            socialLinks: source.siteMetadata.socialLinks || [],
            twitterUsername: source.siteMetadata.twitterUsername || "@sigpwny",
            timezone: source.siteMetadata.timezone || "America/Chicago",
          }
        },
      },
    },
  }
  createResolvers(resolvers)
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions
  const result = await graphql(`
    query GatsbyNode {
      allMeeting(sort: {time_start: ASC}) {
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
            ... on Mdx {
              internal {
                contentFilePath
              }
            }
          }
        }
      }
      allExternalJson {
        redirects: nodes {
          id
          src
          dst
        }
      }
      allInternalJson {
        redirects: nodes {
          id
          src
          dst
          code
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
  const template_redirect_external = path.resolve(`./src/templates/template-redirect-external.tsx`)

  // Generate external redirects
  const redirects_external = result.data.allExternalJson.redirects
  if (redirects_external.length > 0) {
    redirects_external.forEach((redirect) => {
      createPage({
        path: redirect.src,
        component: template_redirect_external,
        context: {
          id: redirect.id,
        },
        trailingSlash: true,
      })
    })
  }

  // Generate internal redirects
  const redirects_internal = result.data.allInternalJson.redirects
  if (redirects_internal.length > 0) {
    redirects_internal.forEach((redirect) => {
      // Generate server side redirects for internal routes
      createRedirect({
        fromPath: redirect.src,
        toPath: redirect.dst,
        statusCode: redirect.code ? redirect.code : 301, // use permanent redirect by default
      })
    })
  }

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