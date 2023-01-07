import React from "react"

import Nav from "./Nav"
import Footer from "./Footer"

interface Props {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => (
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