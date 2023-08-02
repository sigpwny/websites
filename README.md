# sigpwny.com
[![Production deployment build status](https://github.com/sigpwny/sigpwny.com/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/sigpwny/sigpwny.com/actions/workflows/deploy.yml)

The SIGPwny website, built with Gatsby.

## Content Types
Content is composed of Markdown(X) and JSON files in the `content` directory. For more information about the defined content types, see the [content README](./content/README.md).

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
This site only depends on official Gatsby plugins, so unless a plugin becomes deprecated, the latest versions of Gatsby and its plugins are guaranteed to work together. Ensure that breaking changes are addressed when dealing with major semver updates. Do not commit dependency updates without verifying that the site was built successfully and operates normally.

```
npm update
```
