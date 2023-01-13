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

Build for production:
```
gatsby build
```

Serve production:
```
gatsby serve
```

Start a development server:
```
gatsby develop
```

## Content Types

There are 7 content types defined. Italicized types are not explicitly defined.

- Meeting
- Event
- Markdown Page
- *Profile*
  - Admin
  - Alum
  - Helper
- *Redirect*
  - External
  - Internal

The majority of these content types are defined in the frontmatter of Markdown files, with the exception of Redirects, which are defined with JSON files. These content types are stored in the `content` directory, with the exception of Markdown Pages, which are stored in `src/pages_md`.

For more information, see the [content README](./content/README.md).

## Updating Dependencies

This site only depends on official Gatsby plugins, so unless a plugin becomes deprecated, the latest versions of Gatsby and its plugins are pretty much guaranteed to work with each other. Ensure that breaking changes are addressed when dealing with major semver updates. Do not commit dependency updates without first verifying that the site built successfully and still operates normally.

```
npm update
```