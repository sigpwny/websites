import React from "react"

interface Props {
  data: React.ReactNode
}

const Panel = ({ data }: Props) => (
  <>
    <div className="panel">
      {data}
    </div>
  </>
)

export default Panel