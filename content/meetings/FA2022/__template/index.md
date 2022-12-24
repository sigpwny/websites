---
date: "2022-08-21" # required
week_number: 0 # required: current week number in the semester (0-indexed)
title: "Example Topic" # required: title
credit: ["SIGPwny"] # required: specify author name(s)
featured: true # optional: set to true to show this meeting on the home page

image:
  path: "./image.png" # required: display image used for the meeting
  alt: "Pwny logo, black and green" # required: provide a description of the image for accessibility purposes

slides: "./Template_Meeting.pdf" # optional: slides for presentation
recording: "https://youtube.com/@sigpwny" # optional: link to video recording (if there are multiple videos, place them in a playlist and link that)
assets: [ # optional: supplementary files
	# "file1.txt",
	# "file2.zip"
]

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