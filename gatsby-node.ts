import crypto from "crypto";
import fs from "fs-extra";
import ical, { ICalLocation } from "ical-generator";
import path from "path";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Node } from "gatsby";
import { calculateSemester } from "./src/utils/util";
import config from "./gatsby-config";
import * as locations_json from "./content/json/locations.json";

dayjs.extend(utc);

interface Field {
  name: string;
  required?: boolean;
  fields?: Field[];
  resolve?: (ResolverParams) => any;
};

interface ResolverParams {
  node: Node;
  file_node: Node;
};

interface ContentNode {
  type: string;
  gatsbySourceInstanceName: string;
  fields?: Field[];
};

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
    else slug = `${base_dir}${path.posix.join(parsed_path.dir, parsed_path.name)}`;
  }
  return slug;
}

const field_resolvers_card_image: Field[] = [
  { name: "foreground" },
  { name: "background" },
  {
    name: "foreground_image",
    resolve: ({ node }) => {
      if (!node.frontmatter.card_image?.foreground?.endsWith(".svg")) {
        return node.frontmatter.card_image?.foreground;
      }
      return undefined;
    }
  },
  {
    name: "background_image",
    resolve: ({ node }) => {
      if (!node.frontmatter.card_image?.background?.endsWith(".svg")) {
        return node.frontmatter.card_image?.background;
      }
      return undefined;
    }
  },
  { name: "background_color" },
  { name: "alt" },
];

const content_node_types: ContentNode[] = [
  {
    type: "Meeting",
    gatsbySourceInstanceName: "meetings",
    fields: [
      { name: "title", required: true },
      { name: "ical" },
      { name: "time_start", required: true },
      { name: "week_number", required: true },
      {
        name: "credit",
        resolve: ({ node }) => node.frontmatter.credit ?? ["SIGPwny"]
      },
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
      { name: "live_video_url" },
      { name: "slides" },
      { name: "recording" },
      { name: "assets" },
      { name: "tags" },
      {
        name: "semester",
        resolve: ({ node, file_node }) => {
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
        resolve: ({ file_node }) => createSlug("/meetings/", file_node),
      },
      {
        name: "time_close",
        resolve: ({ node, file_node }) => {
          if (node.frontmatter.time_close && dayjs(node.frontmatter.time_close).isValid()) {
            if (dayjs(node.frontmatter.time_close).isAfter(dayjs(node.frontmatter.time_start))) {
              return node.frontmatter.time_close;
            } else {
              console.warn(`${file_node.relativePath}: time_close is before time_start, using default duration`);
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
      {
        name: "credit",
        resolve: ({ node }) => node.frontmatter.credit ?? ["SIGPwny"]
      },
      { name: "sponsors" },
      { name: "location" },
      { name: "description", required: true },
      { name: "card_image", fields: field_resolvers_card_image },
      { name: "links" },
      { name: "stats" },
      {
        name: "slug",
        resolve: ({ file_node }) => createSlug("/events/", file_node),
      },
      {
        name: "time_close",
        resolve: ({ node, file_node }) => {
          if (node.frontmatter.time_close && dayjs(node.frontmatter.time_close).isValid()) {
            if (dayjs(node.frontmatter.time_close).isAfter(dayjs(node.frontmatter.time_start))) {
              return node.frontmatter.time_close;
            } else {
              console.warn(`${file_node.relativePath}: time_close is before time_start, using default duration`);
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
      { name: "card_image", fields: field_resolvers_card_image },
      { name: "primary_link" },
      { name: "links" },
      { name: "tags" },
      {
        name: "slug",
        resolve: ({ node, file_node }) =>
          createSlug("/publications/", file_node, node.frontmatter.slug),
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
      {
        name: "role",
        resolve: ({ node }) => node.frontmatter.role ?? "Admin"
      },
      {
        name: "weight",
        resolve: ({ node }) => node.frontmatter.weight ?? 0
      },
      { name: "links" },
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
      {
        name: "role",
        resolve: ({ node }) => node.frontmatter.role ?? "Alum"
      },
      {
        name: "weight",
        resolve: ({ node }) => node.frontmatter.weight ?? 0
      },
      { name: "links" },
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
      {
        name: "role",
        resolve: ({ node }) => node.frontmatter.role ?? "Helper"
      },
      {
        name: "weight",
        resolve: ({ node }) => node.frontmatter.weight ?? 0
      },
      { name: "links" },
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
      {
        name: "role",
        resolve: ({ node }) => node.frontmatter.role ?? "Member"
      },
      {
        name: "weight",
        resolve: ({ node }) => node.frontmatter.weight ?? 0
      },
      { name: "links" },
    ],
  },
  {
    type: "Org",
    gatsbySourceInstanceName: "orgs",
    fields: [
      { name: "name", required: true },
      { name: "profile_image", required: true },
      { name: "card_image", fields: field_resolvers_card_image },
      { name: "affiliation" },
      { name: "handle" },
      { name: "bio" },
      {
        name: "role",
        resolve: ({ node }) => node.frontmatter.role ?? "Organization"
      },
      {
        name: "weight",
        resolve: ({ node }) => node.frontmatter.weight ?? 0
      },
      { name: "links" },
    ],
  },
];

// Recursively check for required fields and run resolvers
const resolveFields = (
  fields: Field[],
  iter_node: any,
  orig: ResolverParams,
  prev_field_name: string
) => {
  const resolved_fields = {};
  fields.forEach((field) => {
    const field_name = prev_field_name ?
      `${prev_field_name}.${field.name}` :
      field.name;
    if (field.required && (
      !(field.name in iter_node) ||
      iter_node[field.name] === null ||
      iter_node[field.name] === undefined ||
      iter_node[field.name] === ""
    )) {
      throw new Error(
        `Required field "${field_name}" is missing for ${orig.file_node.absolutePath}`
      );
    }
    // Recursive step
    if (field.fields && field.name in iter_node) {
      resolved_fields[field.name] = resolveFields(
        field.fields,
        iter_node[field.name],
        orig,
        field_name
      );
    // Run resolver
    } else if (field.resolve) {
      resolved_fields[field.name] = field.resolve(orig);
    } else {
      resolved_fields[field.name] = iter_node[field.name];
    }
  });
  return resolved_fields;
};

exports.onCreateNode = ({
  node,
  actions,
  getNode,
  createNodeId,
  createContentDigest
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
    const { type, fields } = content_node_type;

    // Check required fields and run resolvers
    const resolved_fields = fields ?
      resolveFields(fields, node.frontmatter, { node, file_node }, "") :
      undefined;

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
      ...resolved_fields
    };
    createNode(content_node);
    createParentChildLink({ parent: node, child: content_node });
  }
};

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;
  const sdl = fs.readFileSync("./gatsby-schema.graphql", "utf8");
  createTypes(sdl);
};

exports.createResolvers = ({ createResolvers }) => {
  const createICalendarUID = (uniq_id: string) => {
    const hash = crypto.createHash("sha256").update(uniq_id).digest("hex");
    return `${hash}@sigpwny.com`;
  }
  const createICalendarDescription = (
    description: string,
    location: string,
    page_url: string,
    video_url?: string
  ) => {
    const str_page_url = page_url ? `${page_url}\n\n` : "";
    const str_location = location ? `Location: ${location}\n\n` : "";
    const str_description = description ? `${description}\n\n` : "";
    const str_video_url = video_url ? `----( Video Call )----\n${video_url}\n---===---\n\n` : "";
    return `${str_page_url}${str_location}${str_description}${str_video_url}`.trim();
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
            description: source.ical?.description ?? createICalendarDescription(source.description, source.location, page_url, video_url),
            location: createICalendarLocation(source.location, locations_json),
            url: undefined,
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
            description: source.ical?.description ?? createICalendarDescription(source.description, source.location, page_url),
            location: source.ical?.location ?? createICalendarLocation(source.location, locations_json),
            url: undefined,
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
      allRedirectsJson {
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
  // const template_redirect_client = path.resolve(`./src/templates/template-redirect-client.tsx`);

  // Generate redirects
  const redirects = result.data.allRedirectsJson.redirects;
  if (redirects.length > 0) {
    redirects.forEach((redirect) => {
      // Generate client side redirect pages (in case server side redirects are not supported)
      // createPage({
      //   path: redirect.src,
      //   component: template_redirect_client,
      //   context: {
      //     id: redirect.id,
      //   },
      //   trailingSlash: true,
      // });
      // Generate server side redirects for internal routes
      createRedirect({
        fromPath: redirect.src.endsWith("/")
          ? redirect.src.slice(0, -1)
          : redirect.src,
        toPath: redirect.dst,
        statusCode: redirect.code ?? 302,
      });
      createRedirect({
        fromPath: redirect.src.endsWith("/")
          ? redirect.src
          : redirect.src + "/",
        toPath: redirect.dst,
        statusCode: redirect.code ?? 302,
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
            statusCode: 302,
          });
          createRedirect({
            fromPath: `${page.slug}slides/`,
            toPath: page.slides.publicURL,
            statusCode: 302,
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
exports.onPostBuild = ({ graphql }) => {
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
      result.errors.forEach((e) => console.error(e.toString()));
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
