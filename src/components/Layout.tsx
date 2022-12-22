import React from "react"

import Nav from "./Nav"
import Footer from "./Footer"

interface Props {
  children: React.ReactNode
}

type LayoutType = "page" | "meeting" | "event"

const Layout = ({ children }: Props, layoutType: LayoutType) => (
  <>
    <div className="flex flex-col min-h-screen">
      <Nav />
      <div className="container grow">
        {children}
      </div>
    </div>
    <Footer />
  </>
)

export default Layout