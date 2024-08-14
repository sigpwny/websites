# sigpwny.com
[![Production deployment build status](https://github.com/sigpwny/sigpwny.com/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/sigpwny/sigpwny.com/actions/workflows/deploy.yml)

The SIGPwny website, built with Astro.

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

```
npm update
```

## License
SIGPwny's educational content, slides, and recordings are licensed under the [CC BY-SA 4.0 license](./LICENSE).

Published content that is not SIGPwny branded are copyrighted by their respective owners unless otherwise stated.

All other website code is licensed under the [BSD 3-Clause license](./LICENSE-CODE).
