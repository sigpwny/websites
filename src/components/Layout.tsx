import React from "react"

import Nav from "./Nav"

interface LayoutProps {
  children: React.ReactNode
}

type LayoutType = "page" | "meeting" | "event"

const Layout = ({ children }: LayoutProps, layoutType: LayoutType) => (
  <>
    <Nav />
    <div className="container">
      {children}
    </div>
    {/* insert footer here */}
  </>
)

export default Layout