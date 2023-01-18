# sigpwny.com

The new SIGPwny website, built with Gatsby.

## Content Types

This site defines multiple content types that allow for customization, flexibility, and ease of use. For more information, see the [content README](./content/README.md).

## Installing and Building

Clean install all node packages:
```
npm ci
```

Install `gatsby-cli`:
```
npm install -g gatsby-cli
```

Build production and serve:
```
gatsby build
gatsby serve
```

Start a development server:
```
gatsby develop
```

## Updating Dependencies

This site only depends on official Gatsby plugins, so unless a plugin becomes deprecated, the latest versions of Gatsby and its plugins are pretty much guaranteed to work with each other. Ensure that breaking changes are addressed when dealing with major semver updates. Do not commit dependency updates without first verifying that the site built successfully and still operates normally.

```
npm update
```