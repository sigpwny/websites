import path from "path";
import { createFilePath } from "gatsby-source-filesystem";
import { calculateSemester } from "./src/utils/util";
import config from "./gatsby-config"

interface Field {
  name: string;
  required?: boolean;
  fields?: Field[];
}

interface ContentNode {
  type: string;
  gatsbySourceInstanceName: string;
  fields?: Field[];
  computedFields?: {
    name: string;
    resolve: (node: any, file_node: any) => any;
  }[];
}

// https://github.com/react-pdf-viewer/react-pdf-viewer/issues/497#issuecomment-812905172
// https://github.com/wojtekmaj/react-pdf/issues/874#issuecomment-1539023628
exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions,
}) => {
  if (stage === "build-html" || stage === "develop-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /canvas/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
};

function createSlug(base_dir: string, file_node: any, slug?: string) {
  if (!slug) {
    const parsed_path = path.parse(file_node.relativePath);
    if (parsed_path.name === "index") slug = `${base_dir}${parsed_path.dir}/`;
    else slug = `${base_dir}${path.join(parsed_path.dir, parsed_path.name)}`;
  }
  return slug;
}

const content_node_types: ContentNode[] = [
  {
    type: "Meeting",
    gatsbySourceInstanceName: "meetings",
    fields: [
      { name: "title", required: true },
      { name: "time_start", required: true },
      { name: "time_close" },
      { name: "week_number", required: true },
      { name: "credit", required: true },
      { name: "featured" },
      { name: "location" },
      {
        name: "image",
        required: false,
        fields: [
          { name: "path", required: true },
          { name: "alt", required: true },
        ],
      },
      { name: "slides" },
      { name: "recording" },
      { name: "assets" },
      { name: "tags" },
    ],
    computedFields: [
      {
        name: "semester",
        resolve: (node, file_node) => {
          const semester = calculateSemester(node.frontmatter.time_start);
          const semester_from_path = file_node.relativePath.split("/")[0];
          if (semester.toLowerCase() != semester_from_path.toLowerCase()) {
            console.warn(
              `Calculated semester "${semester}" does not match directory "${semester_from_path}" for ${file_node.absolutePath}`
            );
          }
          return semester;
        },
      },
      {
        name: "slug",
        resolve: (node, file_node) => createSlug("/meetings/", file_node),
      },
      {
        name: "timezone",
        resolve: (node, file_node) => node.frontmatter.timezone ?? config.siteMetadata?.timezone ?? "Etc/UTC"
      },
    ],
  },
  {
    type: "Event",
    gatsbySourceInstanceName: "events",
    fields: [
      { name: "title", required: true },
      { name: "series", required: true },
      { name: "description", required: true },
      { name: "time_start", required: true },
      { name: "time_close" },
      { name: "location" },
      {
        name: "overlay_image",
        required: false,
        fields: [
          { name: "path", required: true },
          { name: "alt", required: true },
        ],
      },
      {
        name: "background_image",
        required: false,
        fields: [
          { name: "path", required: true },
          { name: "alt", required: true },
        ],
      },
      { name: "links" },
      { name: "stats" },
    ],
    computedFields: [
      {
        name: "slug",
        resolve: (node, file_node) => createSlug("/events/", file_node),
      },
      {
        name: "timezone",
        resolve: (node, file_node) => node.frontmatter.timezone ?? config.siteMetadata?.timezone ?? "Etc/UTC"
      },
    ],
  },
  {
    type: "Publication",
    gatsbySourceInstanceName: "publications",
    fields: [
      { name: "title", required: true },
      { name: "credit", required: true },
      { name: "publication_type", required: true },
      { name: "publisher" },
      { name: "date", required: true },
      { name: "description" },
      {
        name: "image",
        required: true,
        fields: [
          { name: "path", required: true },
          { name: "alt", required: true },
        ],
      },
      { name: "primary_link" },
      { name: "other_links" },
      { name: "tags" },
    ],
    computedFields: [
      {
        name: "slug",
        resolve: (node, file_node) =>
          createSlug("/publications/", file_node, node.frontmatter.slug),
      },
      {
        name: "timezone",
        resolve: (node, file_node) => node.frontmatter.timezone ?? config.siteMetadata?.timezone ?? "Etc/UTC"
      },
    ],
  },
  {
    type: "PageMarkdown",
    gatsbySourceInstanceName: "pages_md",
    fields: [
      { name: "title", required: true },
      { name: "description" },
      {
        name: "options",
        fields: [{ name: "full_width" }, { name: "no_background" }],
      },
    ],
    computedFields: [
      {
        name: "slug",
        resolve: (node, file_node) =>
          createSlug("/", file_node, node.frontmatter.slug),
      },
    ],
  },
  {
    type: "Admin",
    gatsbySourceInstanceName: "admins",
    fields: [
      { name: "name", required: true },
      { name: "profile_image", required: true },
      { name: "handle" },
      { name: "bio" },
      { name: "links" },
    ],
    computedFields: [
      {
        name: "role",
        resolve: (node, file_node) => node.frontmatter.role ?? "Admin"
      },
      {
        name: "weight",
        resolve: (node, file_node) => node.frontmatter.weight ?? 0
      },
    ],
  },
  {
    type: "Helper",
    gatsbySourceInstanceName: "helpers",
    fields: [
      { name: "name", required: true },
      { name: "profile_image", required: true },
      { name: "handle" },
      { name: "bio" },
      { name: "links" },
    ],
    computedFields: [
      {
        name: "role",
        resolve: (node, file_node) => node.frontmatter.role ?? "Helper"
      },
      {
        name: "weight",
        resolve: (node, file_node) => node.frontmatter.weight ?? 0
      },
    ],
  },
  {
    type: "Alum",
    gatsbySourceInstanceName: "alumni",
    fields: [
      { name: "name", required: true },
      { name: "profile_image", required: true },
      { name: "handle" },
      { name: "period" },
      { name: "work" },
      { name: "bio" },
      { name: "links" },
    ],
    computedFields: [
      {
        name: "role",
        resolve: (node, file_node) => node.frontmatter.role ?? "Alum"
      },
      {
        name: "weight",
        resolve: (node, file_node) => node.frontmatter.weight ?? 0
      },
    ],
  },
  {
    type: "Member",
    gatsbySourceInstanceName: "members",
    fields: [
      { name: "name", required: true },
      { name: "profile_image", required: true },
      { name: "handle" },
      { name: "bio" },
      { name: "links" },
    ],
    computedFields: [
      {
        name: "role",
        resolve: (node, file_node) => node.frontmatter.role ?? "Member"
      },
      {
        name: "weight",
        resolve: (node, file_node) => node.frontmatter.weight ?? 0
      },
    ],
  },
];

exports.onCreateNode = ({
  node,
  actions,
  getNode,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode, createParentChildLink } = actions;
  if (node.internal.type === "Mdx") {
    // Parent child relations:
    // file_node (File) -> node (Mdx) -> content_node (type from content_node_types)
    const file_node = getNode(node.parent);
    const sourceInstanceName = file_node.sourceInstanceName;

    // Get the content node type based on the source instance name
    const content_node_type = content_node_types.find(
      (node) => node.gatsbySourceInstanceName === sourceInstanceName
    );
    if (!content_node_type) return;
    const { type, fields, computedFields } = content_node_type;

    // Recursively check for required fields
    const checkRequiredFields = (
      fields: Field[],
      node: any,
      prev_field_name: string
    ) => {
      for (const field of fields) {
        if (field.required) {
          if (
            node[field.name] === null ||
            node[field.name] === undefined ||
            node[field.name] === ""
          ) {
            throw new Error(
              `"${prev_field_name}${field.name}" is required for ${file_node.absolutePath}`
            );
          }
        }
        if (field.fields && node[field.name])
          checkRequiredFields(
            field.fields,
            node[field.name],
            prev_field_name + field.name + "."
          );
      }
    };

    // Check MDX frontmatter
    if (fields) checkRequiredFields(fields, node.frontmatter, "");

    // Create content node
    const content_node = {
      id: createNodeId(`${type}-${node.id}`),
      parent: node.id,
      children: [],
      internal: {
        type,
        content: JSON.stringify(node),
        contentDigest: createContentDigest(node),
      },
      // Add fields defined in content node
      ...(fields &&
        fields.reduce((acc, field) => {
          acc[field.name] = node.frontmatter[field.name];
          return acc;
        }, {})),
      // Add fields that need to be resolved/computed
      ...(computedFields &&
        computedFields.reduce((acc, field) => {
          acc[field.name] = field.resolve(node, file_node);
          return acc;
        }, {})),
    };
    createNode(content_node);
    createParentChildLink({ parent: node, child: content_node });
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type Site implements Node {
      siteMetadata: SiteMetadata!
    }

    type Link {
      name: String!
      link: String!
    }

    type SiteMetadata {
      title: String!
      siteUrl: String!
      description: String!
      image: String!
      navLinks: [Link]
      navCallToActionLinks: [Link]
      socialLinks: [Link]
      timezone: String!
    }

    type ImageAlt @dontInfer {
      path: File! @fileByRelativePath
      alt: String!
    }

    type Stat {
      name: String!
      value: String!
    }

    type Meeting implements Node @dontInfer {
      title: String!
      time_start: Date! @dateformat
      time_close: Date @dateformat
      week_number: Int!
      credit: [String!]!
      credit_profiles: [Profile]! @link(by: "name", from: "credit")
      featured: Boolean
      location: String
      image: ImageAlt
      slides: File @fileByRelativePath
      recording: String
      assets: [File] @fileByRelativePath
      tags: [String!]
      semester: String
      slug: String!
      timezone: String!
    }

    type Event implements Node @dontInfer {
      title: String!
      series: String!
      description: String!
      time_start: Date! @dateformat
      time_close: Date @dateformat
      location: String
      overlay_image: ImageAlt
      background_image: ImageAlt
      links: [Link]
      stats: [Stat]
      slug: String!
      timezone: String!
    }

    type Publication implements Node @dontInfer {
      title: String!
      credit: [String!]!
      publication_type: String!
      publisher: String
      date: Date! @dateformat
      description: String
      image: ImageAlt!
      primary_link: String
      other_links: [String]
      tags: [String]
      slug: String!
      timezone: String!
    }

    type PageMarkdownOptions @dontInfer {
      full_width: Boolean
      no_background: Boolean
    }

    type PageMarkdown implements Node @dontInfer {
      title: String!
      description: String
      options: PageMarkdownOptions
      slug: String
    }

    interface Profile {
      name: String!
      profile_image: File! @fileByRelativePath
      handle: String
      bio: String
      links: [Link]
      role: String!
      weight: Int!
    }

    type Admin implements Node & Profile @dontInfer {
      name: String!
      profile_image: File! @fileByRelativePath
      handle: String
      bio: String
      links: [Link]
      role: String!
      weight: Int!
    }

    type Helper implements Node & Profile @dontInfer {
      name: String!
      profile_image: File! @fileByRelativePath
      handle: String
      bio: String
      links: [Link]
      role: String!
      weight: Int!
    }

    type Alum implements Node & Profile @dontInfer {
      name: String!
      profile_image: File! @fileByRelativePath
      handle: String
      period: String
      work: String
      bio: String
      links: [Link]
      role: String!
      weight: Int!
    }

    type Member implements Node & Profile @dontInfer {
      name: String!
      profile_image: File! @fileByRelativePath
      handle: String
      bio: String
      links: [Link]
      role: String!
      weight: Int!
    }
  `);
};

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
            navCallToActionLinks:
              source.siteMetadata.navCallToActionLinks || [],
            socialLinks: source.siteMetadata.socialLinks || [],
            twitterUsername: source.siteMetadata.twitterUsername || "@sigpwny",
            timezone: source.siteMetadata.timezone || "America/Chicago",
          };
        },
      },
    },
  };
  createResolvers(resolvers);
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;
  const result = await graphql(`
    query GatsbyNode {
      allMeeting(sort: { time_start: ASC }) {
        meetings: nodes {
          id
          slug
          parent {
            ... on Mdx {
              internal {
                contentFilePath
              }
            }
          }
          slides {
            publicURL
          }
        }
      }
      allEvent(sort: { time_start: ASC }) {
        events: nodes {
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
      allPublication(sort: { date: ASC }) {
        publications: nodes {
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
  `);

  if (result.errors) {
    throw result.errors;
  }

  const template_meeting = path.resolve(`./src/templates/template-meeting.tsx`);
  const template_event = path.resolve(`./src/templates/template-event.tsx`);
  const template_publication = path.resolve(
    `./src/templates/template-publication.tsx`
  );
  const template_page_md = path.resolve(`./src/templates/template-page_md.tsx`);
  const template_redirect_external = path.resolve(
    `./src/templates/template-redirect-external.tsx`
  );

  // Generate external redirects
  const redirects_external = result.data.allExternalJson.redirects;
  if (redirects_external.length > 0) {
    redirects_external.forEach((redirect) => {
      createPage({
        path: redirect.src,
        component: template_redirect_external,
        context: {
          id: redirect.id,
        },
        trailingSlash: true,
      });
    });
  }

  // Generate internal redirects
  const redirects_internal = result.data.allInternalJson.redirects;
  if (redirects_internal.length > 0) {
    redirects_internal.forEach((redirect) => {
      // Generate server side redirects for internal routes
      createRedirect({
        fromPath: redirect.src.endsWith("/")
          ? redirect.src.slice(0, -1)
          : redirect.src,
        toPath: redirect.dst,
        statusCode: redirect.code ? redirect.code : 301, // use permanent redirect by default
      });
      createRedirect({
        fromPath: redirect.src.endsWith("/")
          ? redirect.src
          : redirect.src + "/",
        toPath: redirect.dst,
        statusCode: redirect.code ? redirect.code : 301, // use permanent redirect by default
      });
    });
  }

  const meetings = result.data.allMeeting.meetings;
  if (meetings.length > 0) {
    meetings.forEach((meeting, index) => {
      const prev_id =
        index === meetings.length - 1 ? null : meetings[index + 1].id;
      const next_id = index === 0 ? null : meetings[index - 1].id;
      createPage({
        path: meeting.slug,
        component: `${template_meeting}?__contentFilePath=${meeting.parent.internal.contentFilePath}`,
        context: {
          id: meeting.id,
          prev_id,
          next_id,
          layout: "meeting",
        },
        trailingSlash: true,
      });
      // Generate /slides and /slides/ redirect for each meeting
      if (meeting.slides?.publicURL) {
        createRedirect({
          fromPath: `${meeting.slug}slides`,
          toPath: meeting.slides.publicURL,
          statusCode: 301,
        });
        createRedirect({
          fromPath: `${meeting.slug}slides/`,
          toPath: meeting.slides.publicURL,
          statusCode: 301,
        });
      }
    });
  }

  const events = result.data.allEvent.events;
  if (events.length > 0) {
    events.forEach((event_) => {
      createPage({
        path: event_.slug,
        component: `${template_event}?__contentFilePath=${event_.parent.internal.contentFilePath}`,
        context: {
          id: event_.id,
        },
        trailingSlash: true,
      });
    });
  }

  const publications = result.data.allPublication.publications;
  if (publications.length > 0) {
    publications.forEach((publication) => {
      createPage({
        path: publication.slug,
        component: `${template_publication}?__contentFilePath=${publication.parent.internal.contentFilePath}`,
        context: {
          id: publication.id,
        },
        trailingSlash: true,
      });
    });
  }

  const pages_md = result.data.allPageMarkdown.pages_md;
  if (pages_md.length > 0) {
    pages_md.forEach((page_md) => {
      createPage({
        path: page_md.slug,
        component: `${template_page_md}?__contentFilePath=${page_md.parent.internal.contentFilePath}`,
        context: {
          id: page_md.id,
        },
        trailingSlash: true,
      });
    });
  }
};
