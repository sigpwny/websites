import crypto from "crypto";
import fs from "fs-extra";
import ical, { ICalLocation } from "ical-generator";
import path from "path";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { calculateSemester } from "./src/utils/util";
import config from "./gatsby-config";
import * as locations_json from "./content/json/locations.json";

dayjs.extend(utc);

interface Field {
  name: string;
  required?: boolean;
  fields?: Field[];
}

// TODO: Fix types
interface ResolverParams {
  node: any;
  file_node: any;
  reporter: any;
}

interface ContentNode {
  type: string;
  gatsbySourceInstanceName: string;
  fields?: Field[];
  computedFields?: {
    name: string;
    resolve: (ResolverParams) => any;
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
      { name: "ical" }, // TODO: Verify that simple assignment works
      { name: "time_start", required: true },
      { name: "week_number", required: true },
      { name: "credit", required: true },
      { name: "featured" },
      { name: "location" },
      { name: "description" },
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
        resolve: ({ node, file_node, reporter }) => {
          const semester = calculateSemester(node.frontmatter.time_start);
          const semester_from_path = file_node.relativePath.split("/")[0];
          if (semester.toLowerCase() != semester_from_path.toLowerCase()) {
            reporter.warn(
              `Calculated semester "${semester}" does not match directory "${semester_from_path}" for ${file_node.absolutePath}`
            );
          }
          return semester;
        },
      },
      {
        name: "slug",
        resolve: ({ file_node }) => createSlug("/meetings/", file_node),
      },
      {
        name: "time_close",
        resolve: ({ node, file_node, reporter }) => {
          if (node.frontmatter.time_close && dayjs(node.frontmatter.time_close).isValid()) {
            if (dayjs(node.frontmatter.time_close).isAfter(dayjs(node.frontmatter.time_start))) {
              return node.frontmatter.time_close;
            } else {
              reporter.warn(`${file_node.relativePath}: time_close is before time_start, using default duration`);
            }
          }
          // If time_close is not set, use time_start + 1 hour
          return dayjs(node.frontmatter.time_start).add(1, "hour").toISOString();
        },
      },
      {
        name: "timezone",
        resolve: ({ node }) => node.frontmatter.timezone ?? config.siteMetadata?.timezone ?? "Etc/UTC"
      },
    ],
  },
  {
    type: "Event",
    gatsbySourceInstanceName: "events",
    fields: [
      { name: "title", required: true },
      { name: "ical" },
      { name: "time_start", required: true },
      { name: "series", required: true },
      { name: "credit", required: true },
      { name: "location" },
      { name: "description", required: true },
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
        resolve: ({ file_node }) => createSlug("/events/", file_node),
      },
      {
        name: "time_close",
        resolve: ({ node, file_node, reporter }) => {
          if (node.frontmatter.time_close && dayjs(node.frontmatter.time_close).isValid()) {
            if (dayjs(node.frontmatter.time_close).isAfter(dayjs(node.frontmatter.time_start))) {
              return node.frontmatter.time_close;
            } else {
              reporter.warn(`${file_node.relativePath}: time_close is before time_start, using default duration`);
            }
          }
          // If time_close is not set, use time_start + 1 hour
          return dayjs(node.frontmatter.time_start).add(1, "hour").toISOString();
        }
      },
      {
        name: "timezone",
        resolve: ({ node }) => node.frontmatter.timezone ?? config.siteMetadata?.timezone ?? "Etc/UTC"
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
        resolve: ({ node, file_node }) =>
          createSlug("/publications/", file_node, node.frontmatter.slug),
      },
      {
        name: "timezone",
        resolve: ({ node }) => node.frontmatter.timezone ?? config.siteMetadata?.timezone ?? "Etc/UTC"
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
        resolve: ({ node, file_node }) =>
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
        resolve: ({ node }) => node.frontmatter.role ?? "Admin"
      },
      {
        name: "weight",
        resolve: ({ node }) => node.frontmatter.weight ?? 0
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
        resolve: ({ node }) => node.frontmatter.role ?? "Helper"
      },
      {
        name: "weight",
        resolve: ({ node }) => node.frontmatter.weight ?? 0
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
        resolve: ({ node }) => node.frontmatter.role ?? "Alum"
      },
      {
        name: "weight",
        resolve: ({ node }) => node.frontmatter.weight ?? 0
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
        resolve: ({ node }) => node.frontmatter.role ?? "Member"
      },
      {
        name: "weight",
        resolve: ({ node }) => node.frontmatter.weight ?? 0
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
  reporter
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
          acc[field.name] = field.resolve({ node, file_node, reporter });
          return acc;
        }, {})),
    };
    createNode(content_node);
    createParentChildLink({ parent: node, child: content_node });
  }
};

exports.createSchemaCustomization = ({ actions, schema }) => {
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

    type ImageAlt {
      path: File! @fileByRelativePath
      alt: String!
    }

    type Stat {
      name: String!
      value: String!
    }

    interface TemplatedPage implements Node @dontInfer {
      id: ID!
      slug: String!
    }

    type ICalendarEventData {
      uid: String!
      sequence: Int!
      title: String!
      description: String
      location: ICalendarLocationData
      url: String
    }

    type ICalendarLocationData {
      title: String
      address: String
      radius: Float
      geo: ICalendarGeoData
    }

    type ICalendarGeoData {
      lat: Float!
      lon: Float!
    }

    interface ICalendarEvent implements Node @dontInfer {
      id: ID!
      ical: ICalendarEventData!
      time_start: Date! @dateformat
      time_close: Date! @dateformat
    }

    type Meeting implements Node & TemplatedPage & ICalendarEvent @dontInfer {
      title: String!
      ical: ICalendarEventData!
      time_start: Date! @dateformat
      time_close: Date! @dateformat
      week_number: Int!
      credit: [String!]!
      credit_profiles: [Profile]! @link(by: "name", from: "credit")
      featured: Boolean
      location: String
      description: String
      image: ImageAlt
      slides: File @fileByRelativePath
      recording: String
      assets: [File] @fileByRelativePath
      tags: [String!]
      semester: String!
      slug: String!
      timezone: String!
    }

    type Event implements Node & TemplatedPage & ICalendarEvent @dontInfer {
      title: String!
      ical: ICalendarEventData!
      time_start: Date! @dateformat
      time_close: Date! @dateformat
      series: String!
      credit: [String!]!
      credit_profiles: [Profile]! @link(by: "name", from: "credit")
      location: String
      description: String!
      overlay_image: ImageAlt
      background_image: ImageAlt
      links: [Link]
      stats: [Stat]
      slug: String!
      timezone: String!
    }

    type Publication implements Node & TemplatedPage @dontInfer {
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

    type PageMarkdownOptions {
      full_width: Boolean
      no_background: Boolean
    }

    type PageMarkdown implements Node & TemplatedPage @dontInfer {
      title: String!
      description: String
      options: PageMarkdownOptions
      slug: String!
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

exports.createResolvers = ({ createResolvers }, reporter) => {
  const createICalendarUID = (uniq_id: string) => {
    const hash = crypto.createHash("sha256").update(uniq_id).digest("hex");
    return `${hash}@sigpwny.com`; // TODO: Programmatically get domain
  }
  const createICalendarDescription = (description: string, page_url: string, video_url?: string) => {
    const str_page_url = page_url ? `${page_url}\n\n` : "";
    const str_description = description ? `${description}\n\n` : "";
    const str_video_url = video_url ? `----( Video Call )----\n${video_url}\n---===---\n\n` : "";
    return `${str_page_url}${str_description}${str_video_url}`.trim();
  }
  const createICalendarLocation = (init_loc: string, locations: any[]) => {
    if (!init_loc) return undefined;
    if (locations.length !== 0) {
      const full_loc = locations.find((location) =>
        location.matches.some((match) => new RegExp(match).test(init_loc))
      );
      if (full_loc) {
        return {
          title: full_loc.title,
          address: full_loc.address,
          radius: full_loc.radius ?? 100.0,
          geo: full_loc.geo,
        } as ICalLocation;
      }
    }
    return {
      title: init_loc
    } as ICalLocation;
  }

  const resolvers = {
    Site: {
      siteMetadata: {
        resolve: (source, args, context, info) => {
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
    Meeting: {
      ical: {
        resolve: (source, args, context, info) => {
          const site_url = context.nodeModel.getNodeById({ id: "Site" }).siteMetadata.siteUrl;
          const page_url = `${site_url}${source.slug}`;
          const video_url = source.ical?.url ? source.ical.url : (source.recording ? source.recording : undefined);
          const ical_event_data = {
            uid: source.ical?.uid ?? createICalendarUID(`meeting-${source.semester}-${source.title}`),
            sequence: source.ical?.revision ?? 0,
            title: source.ical?.title ? source.ical.title : source.title,
            description: source.ical?.description ?? createICalendarDescription(source.description, page_url, video_url),
            location: createICalendarLocation(source.location, locations_json),
            url: video_url,
          };
          return ical_event_data;
        }
      },
    },
    Event: {
      ical: {
        resolve: (source, args, context, info) => {
          const site_url = context.nodeModel.getNodeById({ id: "Site" }).siteMetadata.siteUrl;
          const page_url = `${site_url}${source.slug}`;
          return {
            uid: source.ical?.uid ?? createICalendarUID(`event-${source.series}-${source.title}`),
            sequence: source.ical?.revision ?? 0,
            title: source.ical?.title ? source.ical.title : source.title,
            description: source.ical?.description ?? createICalendarDescription(source.description, page_url),
            location: source.ical?.location ?? createICalendarLocation(source.location, locations_json),
            url: source.ical?.url ? source.ical.url : undefined,
          };
        }
      },
    },
  };
  createResolvers(resolvers);
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;
  const result = await graphql(`
    query GatsbyNode {
      allTemplatedPage {
        nodes {
          __typename
          id
          slug
          parent {
            ... on Mdx {
              internal {
                contentFilePath
              }
            }
          }
          ... on Meeting {
            slides {
              publicURL
            }
          }
        }
      }
      allRedirectsExternalJson {
        redirects: nodes {
          id
          src
          dst
        }
      }
      allRedirectsInternalJson {
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
  const template_publication = path.resolve(`./src/templates/template-publication.tsx`);
  const template_page_md = path.resolve(`./src/templates/template-page_md.tsx`);
  const template_redirect_external = path.resolve(`./src/templates/template-redirect-external.tsx`);

  // Generate external redirects
  const redirects_external = result.data.allRedirectsExternalJson.redirects;
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
  const redirects_internal = result.data.allRedirectsInternalJson.redirects;
  if (redirects_internal.length > 0) {
    redirects_internal.forEach((redirect) => {
      // Generate server side redirects for internal routes
      createRedirect({
        fromPath: redirect.src.endsWith("/")
          ? redirect.src.slice(0, -1)
          : redirect.src,
        toPath: redirect.dst,
        statusCode: redirect.code ? redirect.code : 301,
      });
      createRedirect({
        fromPath: redirect.src.endsWith("/")
          ? redirect.src
          : redirect.src + "/",
        toPath: redirect.dst,
        statusCode: redirect.code ? redirect.code : 301,
      });
    });
  }

  // Generate templated pages
  const templated_pages = result.data.allTemplatedPage.nodes;
  templated_pages.forEach((page) => {
    let template;
    let layout = "default";
    switch (page.__typename) {
      case "Meeting":
        template = template_meeting;
        layout = "meeting";
        // Generate /slides and /slides/ redirects for each meeting
        if (page.slides?.publicURL) {
          createRedirect({
            fromPath: `${page.slug}slides`,
            toPath: page.slides.publicURL,
            statusCode: 301,
          });
          createRedirect({
            fromPath: `${page.slug}slides/`,
            toPath: page.slides.publicURL,
            statusCode: 301,
          });
        }
        break;
      case "Event":
        template = template_event;
        break;
      case "Publication":
        template = template_publication;
        break;
      case "PageMarkdown":
        template = template_page_md;
        break;
      default:
        throw new Error(`Unknown templated page type: ${page.__typename}`);
    }
    createPage({
      path: page.slug,
      component: `${template}?__contentFilePath=${page.parent.internal.contentFilePath}`,
      context: {
        id: page.id,
        layout,
      },
      trailingSlash: true,
    });
  });
};

// Export calendar items to ICS file
exports.onPostBuild = ({ graphql, reporter }) => {
  return graphql(`
    query CreateICS {
      allICalendarEvent(sort: {time_start: DESC}) {
        nodes {
          ical {
            uid
            sequence
            title
            description
            location {
              title
              address
              radius
              geo {
                lat
                lon
              }
            }
            url
          }
          time_start
          time_close
        }
      }
      site {
        siteMetadata {
          title
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach((e) => reporter.error(e.toString()));
      return;
    }
    const site_name = result.data.site.siteMetadata.title;
    const ical_events = result.data.allICalendarEvent.nodes;
    if (ical_events.length > 0) {
      // Generate ICS file
      const full_ics_path = path.join("public", "calendar", "full.ics");
      const full_ics = ical({ name: site_name });
      ical_events.forEach((event) => {
        full_ics.createEvent({
          id: event.ical.uid,
          sequence: event.ical.sequence,
          start: dayjs.utc(event.time_start),
          end: dayjs.utc(event.time_close),
          summary: event.ical.title ?? undefined,
          description: event.ical.description ?? undefined,
          location: event.ical.location as ICalLocation ?? undefined,
          url: event.ical.url ?? undefined,
        });
      });
      fs.outputFileSync(full_ics_path, full_ics.toString());
    }
  });
};