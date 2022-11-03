import React from "react"

import Nav from "./Nav"
import Footer from "./Footer"

interface LayoutProps {
  children: React.ReactNode
}

type LayoutType = "page" | "meeting" | "event"

const Layout = ({ children }: LayoutProps, layoutType: LayoutType) => (
  <>
    <div className="flex flex-col min-h-screen">
      <Nav />
      <div className="container grow">
        {children}
      </div>
      <Footer />
    </div>
  </>
)

export default Layout