import React from "react"

interface ReactProps {
  children: React.ReactNode
}

const Panel = ({ children }: ReactProps) => (
  <>
    <div className="panel">
      {children}
    </div>
  </>
)

export default Panel