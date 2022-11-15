import React, {useState} from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { Disclosure, Menu, Transition } from "@headlessui/react"

import PwnySvg from "./PwnySvg"

// create type for nav links
type NavLink = {
  name: string
  link: string
}

// graphql query to get nav links
const navQuery = graphql`
query {
  site {
    siteMetadata {
      navLinks {
        name
        link
      }
      navCallToActionLinks {
        name
        link
      }
    }
  }
}
`

function Nav() {
  // create navigation array based on query results
  const navLinks: NavLink[] = useStaticQuery(navQuery).site.siteMetadata.navLinks
  const navCallToActionLinks: NavLink[] = useStaticQuery(navQuery).site.siteMetadata.navCallToActionLinks

  return(
    <>
      <Disclosure as="nav" className="my-6">
        {({ open }) => (
          <>
            <div className="container">
              <div className="relative flex items-center justify-between h-16">
                <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                  {/* Mobile hamburger menu button*/}
                  <Disclosure.Button className="navbar-toggler">
                    <span className="sr-only">Open main menu</span>
                    <span className={ open ? "" : "collapsed" }>
                      <span className="icon-bar top-bar" />
                      <span className="icon-bar middle-bar" />
                      <span className="icon-bar bottom-bar" />
                    </span>
                  </Disclosure.Button>
                </div>
                <div className="flex-1 flex items-center justify-center md:items-stretch md:justify-start">
                  <div className="flex-shrink-0 flex items-center">
                    <Link to="/">
                      <PwnySvg />
                    </Link>
                  </div>
                  <div className="hidden md:block md:ml-6 my-auto">
                    <div className="flex">
                      <div className="flex space-x-6 lg:space-x-8">
                        {navLinks.map((item) => (
                          <Link
                            key={item.name}
                            to={item.link}
                            className="font-bold text-xl lg:text-2xl my-auto leading-normal"
                            activeClassName="nav-active"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                      <div className="absolute right-0 space-x-2 lg:space-x-4">
                        {navCallToActionLinks.map((item) => (
                          <Link
                            key={item.name}
                            to={item.link}
                            className="font-bold text-xl lg:text-2xl my-auto leading-normal btn-primary"
                            activeClassName="nav-active"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Transition
              enter="transition duration-100 ease"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className="md:hidden">
                <div className="container">
                  {navLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.link}
                      className="font-bold text-2xl leading-normal block"
                      activeClassName="nav-active"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <hr />
                  {navCallToActionLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.link}
                      className="font-bold text-2xl leading-normal block"
                      activeClassName="nav-active"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <hr />
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </>
  )
}

export default Nav