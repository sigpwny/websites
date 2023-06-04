import React, { useState } from "react"
import { motion } from "framer-motion"

const SIGPwnyMorphology = () => {
  const [isExpanded, setExpanded] = useState(false)
  const [isFirstRender, setFirstRender] = useState(true)
  if (isFirstRender) {
    setFirstRender(false)
    setTimeout(() => {
      setExpanded(true)
    }, 200)
  }
  const variants = {
    minimized: {
      opacity: 0,
      transition: {
        duration: 0.0,
        delay: 0.0,
      }
    },
    expanded: {
      opacity: 1,
      transition: {
        duration: 0.2,
        delay: 0.5,
      },
    }
  }
  return (
    <motion.div
      layout
      className="flex flex-row mx-auto my-6 cursor-pointer select-none"
      onClick={() => setExpanded(!isExpanded)}
    >
      <motion.div layout className="flex flex-col">
        <p className="text-primary font-bold text-right text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
          SIG
        </p>
        <motion.div
          layout
          variants={variants}
          initial="minimized"
          animate={isExpanded ? "expanded" : "minimized"}
        >
          <p className="text-center">&#8595;</p>
          <p className="font-bold text-center">
            Special <br />Interest <br />Group
          </p>
        </motion.div>
      </motion.div>
      <motion.div
        layout
        className={"flex flex-col" + (isExpanded ? "" : " hidden")}
        variants={variants}
        initial="minimized"
        animate={isExpanded ? "expanded" : "minimized"}
      >
        <p className="text-primary font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
          &nbsp;&bull;&nbsp;
        </p>
      </motion.div>
      <motion.div layout className="flex flex-col">
        <p className="text-primary font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
          Pwn
        </p>
        <motion.div
          layout
          variants={variants}
          initial="minimized"
          animate={isExpanded ? "expanded" : "minimized"}
        >
          <p className="text-center">&#8595;</p>
          <p className="font-bold text-center">
            To hack <br />or "own" <br />(slang)
          </p>
        </motion.div>
      </motion.div>
      <motion.div
        layout
        className={"flex flex-col" + (isExpanded ? "" : " hidden")}
        variants={variants}
        initial="minimized"
        animate={isExpanded ? "expanded" : "minimized"}
      >
        <p className="text-primary font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
          &nbsp;&bull;&nbsp;
        </p>
      </motion.div>
      <motion.div layout className="flex flex-col">
        <p className="text-primary font-bold text-left text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
          y
        </p>
        <motion.div
          layout
          variants={variants}
          initial="minimized"
          animate={isExpanded ? "expanded" : "minimized"}
        >
          <p className="text-center">&#8595;</p>
          <p className="font-bold text-center">
            For <br />cool <br />logo
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default SIGPwnyMorphology