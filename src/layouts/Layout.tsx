import React from "react"

import Nav from "../components/Nav"
import Footer from "../components/Footer"

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
    </div>
    <Footer />
  </>
)

export default Layout