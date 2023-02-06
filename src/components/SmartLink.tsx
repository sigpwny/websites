import React from "react"
import { Link as GatsbyLink } from "gatsby"

interface Props {
  children: React.ReactNode
  to: string
  activeClassName?: string
  partiallyActive?: boolean
  [key: string]: any
}

const SmartLink = ({ children, to, activeClassName, partiallyActive, ...other }: Props) => {
  // This assumes that any internal link (intended for Gatsby)
  // will start with exactly one slash, and that anything else is external.
  const internal = /^\/(?!\/)/.test(to)

  // Use Gatsby Link for internal links, and <a> for others
  if (internal) {
    return (
      <GatsbyLink
        to={to}
        activeClassName={activeClassName}
        partiallyActive={partiallyActive}
        {...other}
      >
        {children}
      </GatsbyLink>
    )
  }
  return (
    <a href={to} {...other}>
      {children}
    </a>
  )
}

export default SmartLink