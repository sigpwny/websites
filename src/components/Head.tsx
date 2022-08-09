import React from "react"

interface MetaData {
  title: string
  description: string
  url: string
  image?: string
  twitterUsername?: string
  twitterCard?: string
}

// will contain boilerplate code soon
export default function Head() {
  return (
    <>
      <title>Hello World</title>
      <meta name="description" content="Hello World" />
    </>
  )
}