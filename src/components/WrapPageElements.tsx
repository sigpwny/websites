import React from "react"
import { AnimatePresence } from "framer-motion"
import Layout from "./Layout"

interface Props {
  element: React.ReactNode
}

const wrapPageElement = ({element}: Props) => (
  <Layout>
    <AnimatePresence initial={true} mode="wait">
      {element}
    </AnimatePresence>
  </Layout>
)

export default wrapPageElement