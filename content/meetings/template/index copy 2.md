---
date: "2022-08-21" # required
title: "Template Meeting" # required: title
credit: "Author Name" # required: specify author name(s)
featured: true # optional: set to true to hide this meeting from the home page

image:
  path: "./image.png" # required: image must be in the same folder as this markdown file
  alt: "Pwny logo, black and green" # required: provide a description of the image for accessibility purposes

slides: "./template-meeting.pdf" # optional: PDF should be in the same folder and the name should be the title; replacing spaces with dashes (NOT underscores)
assets: [] # optional: supplementary files, e.g: `assets: ["./file1.txt", "./file2.zip"]`
recording: null # optional: set to a string containing an external link to the meeting recording

# add a main topic tag: "web", "pwn", "rev", "crypto", "forensics", "osint", "ai", "misc"
# plus, add tags for specific topics, such as "xss" or "rsa" or "lockpicking"
# try to re-use tags from past meetings and limit the number of tags to 5
# all tags will be lowercased
tags: [
	"misc",
	"template",
	"DEMO" # will render as "demo"
]
---

Put a few sentences here describing your topic! This can be treated as an abstract. Please make sure to check spelling, punctuation, capitalization, and grammar!