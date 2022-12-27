# sigpwny.com

The new SIGPwny website, built with Gatsby.

## Installing and Building

Download all node packages:
```
npm ci
```

Install `gatsby-cli`:
```
npm install -g gatsby-cli
```

Start a development server:
```
gatsby develop
```

Build for production:
```
gatsby build
```

Serve production:
```
gatsby serve
```

## Content Types

There are 7 content types defined:

- Meeting
- Events
- Profiles (does not count as a content type)
  - Admins
  - Alumni
  - Helpers
- Redirects
- Markdown Pages

The majority of these content types are defined in the frontmatter of Markdown files, with the exception of Redirects, which are defined with JSON files. These content types are stored in the `content` directory, with the exception of Markdown Pages, which are stored in `src/pages_md`.

## Updating Dependencies

This site only depends on official Gatsby plugins, so unless a plugin is deprecated, the latest versions of Gatsby and its plugins are pretty much guaranteed to work with each other. Ensure that breaking changes are addressed when dealing with major semver updates. Do not commit dependency updates without first verifying that the site built successfully and still operates normally.