import React from "react"
// import { AnimatePresence } from "framer-motion"
import Layout from "./Layout"

interface Props {
  element: React.ReactNode
}

const wrapPageElement = ({element}: Props) => (
    <Layout>
        {/* <AnimatePresence initial={true} exitBeforeEnter>{children}</AnimatePresence> */}
        {element}
    </Layout>
)

export default wrapPageElement