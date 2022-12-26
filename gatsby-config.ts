import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `SIGPwny`,
    siteUrl: `https://sigpwny.com`, // no trailing slash
    description: `SIGPwny is a student-run organization at the University of Illinois at Urbana-Champaign focused on information security and privacy.`,
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
      { name: "Discord", link: "https://discord.gg/8qZ3Y4J" },
      { name: "GitHub", link: "https://github.com/sigpwny" },
      { name: "Twitter", link: "https://twitter.com/sigpwny" },
    ],
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "pages",
        "path": "./src/pages/"
      },
      __key: "pages"
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "pages_md",
        "path": "./src/pages_md/"
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "meetings",
        "path": "./content/meetings/"
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "events",
        "path": "./content/events/"
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "admins",
        "path": "./content/profiles/admins/"
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "alumni",
        "path": "./content/profiles/alumni/"
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "helpers",
        "path": "./content/profiles/helpers/"
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-mdx",
    "gatsby-plugin-postcss",
    "gatsby-plugin-sharp",
    "gatsby-plugin-sitemap",
    "gatsby-transformer-remark",
    "gatsby-transformer-sharp",
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        "icon": "./src/images/logo/pwny8-48x48.png"
      }
    },
  ]
};

export default config;
