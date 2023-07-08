import React from "react"
import { AnimatePresence } from "framer-motion"
import Layout from "./Layout"
import LayoutMeeting from "./LayoutMeeting"

interface Props {
  element: React.ReactNode,
  props: any
}

const wrapPageElement = ({element, props}: Props) => {
  return (
    <Layout>
      <AnimatePresence initial={true} mode="wait">
      {props.pageContext?.layout === "meeting" ? (
        <LayoutMeeting>
          {element}
        </LayoutMeeting>
      ) : (
        <>
          {element}
        </>
      )}
      </AnimatePresence>
    </Layout>
  )
}

export default wrapPageElement