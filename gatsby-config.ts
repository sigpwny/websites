import type { GatsbyConfig } from "gatsby";
import remarkGfm from "remark-gfm";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `SIGPwny`,
    siteUrl: `https://sigpwny.com`, // no trailing slash
    description: `SIGPwny is a student-run organization at the University of Illinois Urbana-Champaign focused on information security and privacy.`,
    image: `https://sigpwny.com/pwny8-dark-512x512.png`,
    navLinks: [
      { name: "SIGPwny", url: "/" },
      { name: "About", url: "/about/" },
      { name: "Meetings", url: "/meetings/" },
      { name: "Publications", url: "/publications/"},
      { name: "Events", url: "/events/" },
      { name: "Sponsors", url: "/sponsors/" },
    ],
    navCallToActionLinks: [{ name: "Join", url: "/join/" }],
    socialLinks: [
      { name: "Discord", url: "https://discord.gg/cWcZ6a9" },
      { name: "GitHub", url: "https://github.com/sigpwny" },
      { name: "Instagram", url: "https://www.instagram.com/sigpwny/" },
      { name: "Twitter", url: "https://twitter.com/sigpwny" },
      { name: "YouTube", url: "https://www.youtube.com/@sigpwny" },
    ],
    twitterUsername: "@sigpwny",
    timezone: "America/Chicago",
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages_md",
        path: "./src/pages_md/",
        ignore: [`**/.*`],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
        ignore: [`**/.*`],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "meetings",
        path: "./content/meetings/",
        ignore: [`**/.*`],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "events",
        path: "./content/events/",
        ignore: [`**/.*`],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "publications",
        path: "./content/publications/",
        ignore: [`**/.*`],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "admins",
        path: "./content/profiles/admins/",
        ignore: [`**/.*`],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "alumni",
        path: "./content/profiles/alumni/",
        ignore: [`**/.*`],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "helpers",
        path: "./content/profiles/helpers/",
        ignore: [`**/.*`],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "members",
        path: "./content/profiles/members/",
        ignore: [`**/.*`],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "orgs",
        path: "./content/profiles/orgs/",
        ignore: [`**/.*`],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "json",
        path: "./content/json/",
        ignore: [`**/.*`],
      },
    },
    "gatsby-plugin-catch-links",
    "gatsby-plugin-image",
    "gatsby-plugin-netlify",
    "gatsby-plugin-postcss",
    "gatsby-plugin-sitemap",
    "gatsby-transformer-json",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "./src/images/logo/pwny8-48x48.png",
        icons: [
          {
            src: "./src/images/logo/pwny8-32x32.png",
            sizes: "32x32",
            type: "image/png",
          },
          {
            src: "./src/images/logo/pwny8-dark-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "./src/images/logo/pwny8-dark-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./src/images/logo/pwny8-dark-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "./src/images/logo/pwny8-dark-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-sharp",
      options: {
        defaults: {
          quality: 100,
          placeholder: "none",
          breakpoints: [360, 480, 720, 1280, 1920],
        },
      },
    },
    {
      resolve: "gatsby-plugin-mdx", // https://github.com/gatsbyjs/gatsby/issues/37292
      options: {
        extensions: [".md", ".mdx"],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: ">",
              aliases: {},
              showLineNumbers: false,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              backgroundColor: "none",
              maxWidth: 900,
              quality: 100,
            },
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              destinationDir: "static",
            },
          },
          {
            resolve: `gatsby-remark-katex`,
            options: {
              strict: `ignore`,
            },
          },
        ],
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
    },
  ],
};

export default config;
