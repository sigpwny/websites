# SIGPwny's Websites
[![CI/CD (sigpwny.com)](https://github.com/sigpwny/websites/actions/workflows/deploy-sigpwny.yml/badge.svg)](https://github.com/sigpwny/websites/actions/workflows/deploy-sigpwny.yml)  
[![CI/CD (fallctf.com)](https://github.com/sigpwny/websites/actions/workflows/deploy-fallctf.yml/badge.svg)](https://github.com/sigpwny/websites/actions/workflows/deploy-fallctf.yml)  
[![CI/CD (uiuc.tf)](https://github.com/sigpwny/websites/actions/workflows/deploy-uiuctf.yml/badge.svg)](https://github.com/sigpwny/websites/actions/workflows/deploy-uiuctf.yml)

The SIGPwny website monorepo, built with Astro.

## Installing and Building
Clean install all node packages:
```
npm ci
```
Start a development server:
```
npm run dev
```
Build production and serve:
```
npm run build
npm run serve
```

## Content Types
Content is composed of MarkdownX and JSON files in the `content` directory. For more information about the defined content types, see the [content README](./src/content/README.md).

## Goals
1. **The site should be tenable and functional for the future of the club**.
Prioritizing maintainability and stability will allow for the easy operation of the website long after it was created.
2. **Static-first: static site generation over dynamic sites.**
This is inline with goal 1. Static sites are not only easier to host, they are much cheaper (for basically free). Any dynamic functionality added to the website should be considered as extra or non-critical and should be implemented as a subsystem.
3. **Easy to use.**
If it's not easy to use, then no one knows how to use it. If no one knows how to use it, it won't be used :). Adding support for MDX and git-based CMS is an example of meeting this goal.

## License
SIGPwny's educational content, slides, and recordings are licensed under the [CC BY-SA 4.0 license](./LICENSE).

Published content that is not SIGPwny branded are copyrighted by their respective owners unless otherwise stated.

All other website code is licensed under the [BSD 3-Clause license](./LICENSE-CODE).
