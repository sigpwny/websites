import React, { useEffect, useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { Disclosure, Transition } from "@headlessui/react"

import { PwnySvg } from "./Icons"

interface NavLink {
  name: string
  link: string
}

const Nav = () => {
  const [counter, setCounter] = useState(0)
  const [colorOverride, setColorOverride] = useState<string | null>(null)
  const colors = ["#ed7a31", "#cc66ee", "#41aaff", "#ffc000", "#33cc55"]

  useEffect(() => {
    if (counter % 3 == 0 && counter !== 0) {
      setColorOverride(colors[Math.floor(Math.random() * colors.length)])
    }
  }, [counter])

  const data: Queries.NavQuery = useStaticQuery(graphql`
    query Nav {
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
  `)
  const navLinksResult = data.site?.siteMetadata.navLinks
  const navCallToActionLinksResult = data.site?.siteMetadata.navCallToActionLinks
  // create non-nullable array of nav call to action links
  const navLinks: NavLink[] = []
  navLinksResult?.forEach((item) => {
    if (item?.name && item?.link) {
      const new_link: NavLink = {
        name: item.name,
        link: item.link,
      }
      navLinks.push(new_link)
    }
  })
  // create non-nullable array of nav call to action links
  const navCallToActionLinks: NavLink[] = []
  navCallToActionLinksResult?.forEach((item) => {
    if (item?.name && item?.link) {
      const new_link: NavLink = {
        name: item.name,
        link: item.link,
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
              <div className="relative flex items-center justify-between h-16 rose-400">
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
                {/* Desktop navbar */}
                <div className="flex-1 flex items-center justify-center md:items-stretch md:justify-start">
                  <div className="flex-shrink-0 flex items-center">
                    <Link to="/" className="hover:rotate-[5deg]" onClick={() => setCounter(counter+1)}>
                      <PwnySvg height="48px" />
                    </Link>
                  </div>
                  <div className="hidden md:block md:ml-6 my-auto">
                    <div className="flex">
                      <div className="flex space-x-6 lg:space-x-8">
                        {navLinks.map((item) => (
                          <Link
                            key={item.name}
                            to={item.link}
                            className={`font-bold text-xl lg:text-2xl my-auto leading-normal`}
                            style={colorOverride ? { color: colorOverride } : {}}
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
                            style={colorOverride ? { backgroundColor: colorOverride } : {}}
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
            {/* Mobile navbar */}
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
                    <Disclosure.Button as={Link}
                      key={item.name}
                      to={item.link}
                      className="font-bold text-2xl leading-normal block my-1"
                      activeClassName="nav-active"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                  <hr />
                  {navCallToActionLinks.map((item) => (
                    <Disclosure.Button as={Link}
                      key={item.name}
                      to={item.link}
                      className="font-bold text-2xl leading-normal block my-1"
                      activeClassName="nav-active"
                    >
                      {item.name}
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