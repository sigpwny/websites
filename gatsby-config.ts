import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `SIGPwny`,
    siteUrl: `https://sigpwny.com`, // no trailing slash
    description: `SIGPwny is a student-run organization at the University of Illinois at Urbana-Champaign focused on information security and privacy.`,
    image: `https://sigpwny.com/pwny8-dark-512x512.png`,
    navLinks: [
      { name: "SIGPwny", link: "/" },
      { name: "About", link: "/about/" },
      { name: "Meetings", link: "/meetings/" },
      { name: "Events", link: "/events/" },
      { name: "Sponsors", link: "/sponsors/" },
    ],
    navCallToActionLinks: [
      { name: "Join", link: "/join/" },
    ],
    socialLinks: [
      { name: "Discord", link: "https://discord.gg/cWcZ6a9" },
      { name: "GitHub", link: "https://github.com/sigpwny" },
      { name: "Twitter", link: "https://twitter.com/sigpwny" },
      { name: "YouTube", link: "https://www.youtube.com/@sigpwny" },
    ],
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
        "name": "pages",
        "path": "./src/pages/"
      },
      __key: "pages"
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        "name": "pages_md",
        "path": "./src/pages_md/",
        "ignore": [`**/.*`],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        "name": "meetings",
        "path": "./content/meetings/",
        "ignore": [`**/.*`],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        "name": "events",
        "path": "./content/events/",
        "ignore": [`**/.*`],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        "name": "admins",
        "path": "./content/profiles/admins/",
        "ignore": [`**/.*`],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        "name": "alumni",
        "path": "./content/profiles/alumni/",
        "ignore": [`**/.*`],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        "name": "helpers",
        "path": "./content/profiles/helpers/",
        "ignore": [`**/.*`],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        "name": "redirects",
        "path": "./content/redirects/",
        "ignore": [`**/.*`],
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-mdx",
    "gatsby-plugin-netlify",
    "gatsby-plugin-postcss",
    "gatsby-plugin-sharp",
    "gatsby-plugin-sitemap",
    "gatsby-transformer-json",
    "gatsby-transformer-remark",
    "gatsby-transformer-sharp",
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        "icon": "./src/images/logo/pwny8-48x48.png",
        "icons": [
          {
            "src": "./src/images/logo/pwny8-32x32.png",
            "sizes": "32x32",
            "type": "image/png"
          },
          {
            "src": "./src/images/logo/pwny8-dark-128x128.png",
            "sizes": "128x128",
            "type": "image/png"
          },
          {
            "src": "./src/images/logo/pwny8-dark-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "./src/images/logo/pwny8-dark-256x256.png",
            "sizes": "256x256",
            "type": "image/png"
          },
          {
            "src": "./src/images/logo/pwny8-dark-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          },
        ],
      }
    },
  ]
};

export default config;
