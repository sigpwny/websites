import React from "react"
import { Link } from "gatsby"

import PwnySvg from "./PwnySvg"

const Nav = () => (
  <>
    <div className="container py-3">
      <nav className="navbar navbar-expand-md navbar-custom">
        <Link className="navbar-brand" to="/">
          <PwnySvg />
        </Link>
        <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="icon-bar top-bar" />
          <span className="icon-bar middle-bar" />
          <span className="icon-bar bottom-bar" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav w-100">
            {/* TODO: add aria-current="page" to current page */}
            <li className="nav-item pe-4">
              <Link to="/" className="nav-link-custom" id="random-title">SIGPwny</Link>
            </li>
            <li className="nav-item pe-4">
              <Link to="/meetings/" className="nav-link-custom">Meetings</Link>
            </li>
            <li className="nav-item pe-4">
              <Link to="/events/" className="nav-link-custom">Events</Link>
            </li>
            <li className="nav-item pe-4">
              <Link to="/about/" className="nav-link-custom">About</Link>
            </li>
            <li className="nav-item pe-4 me-auto">
              <Link to="/sponsors/" className="nav-link-custom">Sponsors</Link>
            </li>
            <li className="nav-item">
              <Link to="/join/" className="nav-link-custom">Join</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </>
)

export default Nav