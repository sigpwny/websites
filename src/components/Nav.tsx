import React, { useEffect, useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { Disclosure, Transition } from "@headlessui/react"

import { PwnySvg } from "./Icons"

interface NavLink {
  name: string
  url: string
}

const Nav = () => {
  const [counter, setCounter] = useState(0)
  const colors = [
    {primary: "#33cc55", secondary: "#137137"},
    {primary: "#cc66ee", secondary: "#553366"},
    {primary: "#ed7a31", secondary: "#773311"},
    {primary: "#41aaff", secondary: "#234789"},
    {primary: "#ffc000", secondary: "#876500"},
  ]

  useEffect(() => {
    if (counter % 4 == 0 && counter !== 0) {
      const index = Math.floor(counter / 4) % colors.length
      const nextColor = colors[index]
      document.body.style.setProperty("--color-primary", nextColor.primary)
      document.body.style.setProperty("--color-secondary", nextColor.secondary)
    }
  }, [counter])

  const incrementCounter = () => {
    setCounter(counter+1)
  }

  const data: Queries.NavQuery = useStaticQuery(graphql`
    query Nav {
      site {
        siteMetadata {
          navLinks {
            name
            url
          }
          navCallToActionLinks {
            name
            url
          }
        }
      }
    }
  `)
  const navLinksResult = data.site?.siteMetadata.navLinks
  const navCallToActionLinksResult = data.site?.siteMetadata.navCallToActionLinks
  // create non-nullable array of nav call to action links
  const navLinks: NavLink[] = []
  navLinksResult?.forEach((link) => {
    if (link?.name && link?.url) {
      const new_link: NavLink = {
        name: link.name,
        url: link.url,
      }
      navLinks.push(new_link)
    }
  })
  // create non-nullable array of nav call to action links
  const navCallToActionLinks: NavLink[] = []
  navCallToActionLinksResult?.forEach((link) => {
    if (link?.name && link?.url) {
      const new_link: NavLink = {
        name: link.name,
        url: link.url,
      }
      navCallToActionLinks.push(new_link)
    }
  })
  return(
    <>
      <Disclosure as="nav" className="my-6">
        {({ open }) => (
          <>
            <div className="container">
              <div className="relative flex items-center justify-between h-16">
                <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
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
                {/* Desktop navbar */}
                <div className="flex-1 flex items-center justify-center lg:items-stretch lg:justify-start">
                  <div className="flex-shrink-0 flex items-center">
                    {/* <button title="Pwny" className="hover:rotate-[5deg]" onClick={incrementCounter}> */}
                      <PwnySvg height="48px" />
                    {/* </button> */}
                  </div>
                  <div className="hidden lg:block lg:ml-6 my-auto">
                    <div className="flex">
                      <div className="flex space-x-6 lg:space-x-8">
                        {navLinks.map((link) => (
                          <Link
                            key={link.name}
                            to={link.url}
                            className="font-bold text-xl lg:text-2xl my-auto leading-normal"
                            activeClassName="nav-active"
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                      <div className="absolute right-0 space-x-2 lg:space-x-4">
                        {navCallToActionLinks.map((link) => (
                          <Link
                            key={link.name}
                            to={link.url}
                            className="font-bold text-xl lg:text-2xl my-auto leading-normal btn-primary"
                            activeClassName="nav-active"
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Mobile navbar */}
            <Transition
              enter="transition duration-100 ease"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className="lg:hidden">
                <div className="container">
                  {navLinks.map((link) => (
                    <Disclosure.Button as={Link}
                      key={link.name}
                      to={link.url}
                      className="font-bold text-2xl leading-normal block my-1"
                      activeClassName="nav-active"
                    >
                      {link.name}
                    </Disclosure.Button>
                  ))}
                  <hr />
                  {navCallToActionLinks.map((link) => (
                    <Disclosure.Button as={Link}
                      key={link.name}
                      to={link.url}
                      className="font-bold text-2xl leading-normal block my-1"
                      activeClassName="nav-active"
                    >
                      {link.name}
                    </Disclosure.Button>
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