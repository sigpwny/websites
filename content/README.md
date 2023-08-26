# Content Types

There are 8 content types defined. Italicized types are not explicitly defined.

- [Meeting](#meeting)
- [Event](#event)
- [Publication](#publication)
- [Markdown Page](#markdown-page)
- [*Profile*](#profile)
  - [Admin](#admin)
  - [Alum](#alum)
  - [Helper](#helper)
- [*Redirect*](#redirect)
  - [External](#external)
  - [Internal](#internal)

The majority of these content types are defined in the frontmatter of Markdown files, with the exception of Redirects, which are defined with JSON files. These content types are stored in the `content` directory, with the exception of Markdown Pages, which are stored in `src/pages_md`.

> **Note**  
> Current SIGPwny helpers can manage content through [Netlify CMS](https://cms.sigpwny.com/). Access to the CMS can be managed by SIGPwny admins on [Netlify](https://app.netlify.com/sites/cms-sigpwny-com/identity).

## Meeting

Stored in `content/meetings`.

Meetings are defined in MD or MDX files.

```markdown
---
title: Example Topic # required
time_start: 2022-08-21T23:00:00.000Z # required
time_close: 2022-08-22T00:00:00.000Z # optional
week_number: 0 # required
credit: # required (must contain 1 or more names)
  - Author 1
  - Author 2
featured: true # optional: determines whether a meeting is shown as a card on the home page
location: Siebel CS 1404 + Zoom # optional
slides: ./Template_Meeting.pdf # optional: slides should be located relative to the markdown file
assets: # optional: files should be located relative to the markdown file
  - "file1"
  - "file2.zip"
image: # optional: if none is provided, a placeholder image will be used
  path: ./image.png # optional: image should be located relative to the markdown file, 16:9 aspect ratio, minimum width: 512px
  alt: SIGPwny template image # optional
recording: https://youtu.be/dQw4w9WgXcQ # optional: if there are multiple videos, link a playlist instead

# Add a main topic tag: "web", "pwn", "rev", "crypto", "forensics", "jail", "osint", "misc".
# Plus, add tags for specific topics, such as "xss", "rsa", or "lockpicking".
# Try to re-use tags from past meetings.
tags: # optional
  - misc
  - template
  - DEMO
---
Put a few sentences here describing your topic! This can be treated as an abstract. Please make sure to check spelling, punctuation, capitalization, and grammar!

*Note: You can use markdown/HTML here!*
```

## Event

Stored in `content/events`.

```markdown
WIP
```

## Publication

Stored in `content/publications`.

```markdown
WIP
```

## Markdown Page

Stored in `src/pages_md`.

Markdown Pages are defined in MD or MDX files. MDX files allow for the use of React components within the Markdown body.

```mdx
---
title: "Example Post" # required
slug: "/example" # optional: if not specified, will be generated based on the file's relative path
options:
  full_width: false # optional: if true, page content will span the full container width
  no_background: false # optional: if true, will not contain content with the rounded gray panel background
---
import Card from "../components/Card"
<!-- Import path is relative to the MDX file -->

# Header

Here are some awesome events:

<!-- You can use React components! -->
<Card heading="Heading" title="Title" ... />
```

## *Profile*

Stored in `content/profiles`.

Profiles are markdown files, with varying frontmatter schemas for Admin, Alum, and Helper types. Admins have more fields available, such as bio. Alumni also have exclusive fields, such as graduation year and current line of work.

### Admin

```markdown
---
name: "First Last" # required
bio: | # required
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
  tempor incididunt ut labore et dolore magna aliqua.
image:
  path: "./profile.png" # required, headshot preferred
  alt: "Name's profile picture" # required
handle: "sigpwny" # optional
role: "Test Dummy" # required
weight: 0 # required, larger value is closer to top, otherwise sort by name alphabetically
links: # optional
  email: "hello@sigpwny.com" # optional, will be formatted with mailto:
  website: "https://sigpwny.com/" # optional
  github: "https://github.com/sigpwny" # optional
  twitter: "https://twitter.com/" # optional
  mastodon: "" # optional
  linkedin: "https://www.linkedin.com/" # optional
  discord: "https://discord.com/" # optional
---
Markdown body content on profiles are currently not displayed anywhere yet.
```

### Alum

WIP

### Helper

WIP

## *Redirect*

Stored in `content/redirects`.

This site uses two different types of redirects: external and internal. External redirects are defined as domain-level redirects to other websites, while internal redirects are paths which redirect to paths on the current site.

### External

External redirects are defined in [content/redirects/external.json](./redirects/external.json). Client-side "meta tag" redirects will be used, briefly showing the SIGPwny website and a "Redirecting..." message before navigating to the destination. Internal redirects can also be defined here to use client-side redirects instead of server-side redirects.

```json
[
  {
    "src": "/ctf", // required
    "dst": "https://ctf.sigpwny.com/" // required
  },
  {
    // not recommended if server-side redirects are possible:
    "src": "/fallctf",
    "dst": "/events/"
  },
  // ...
]
```

### Internal

Internal redirects are defined in [content/redirects/internal.json](./redirects/internal.json). The current implementation uses server-side redirects if the hosting provider supports them through the use of a generated `_redirects` file in the build directory (generated by `gatsby-plugin-netlify`, which works on both Netlify and Cloudflare Pages). If the hosting provider does not support server-side redirects (such as GitHub Pages), client side browser redirects should be used instead through external redirects (see above).

```json
[
  {
    "src": "/fallctf", // required
    "dst": "/events/", // required: add trailing slash to prevent an additional redirect (no trailing slash to trailing slash)
    "code": 302, // optional: uses 302 temporary redirect by default
    "type": "" // optional: currently unused, planned for supporting different types of redirects, such as splats or query parameters
  },
  // ...
]
```

Additional references for server-side redirects on hosting providers:
- [Cloudflare Pages](https://developers.cloudflare.com/pages/platform/redirects/)
- [Netlify](https://docs.netlify.com/routing/redirects/)
