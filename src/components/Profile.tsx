import React, { useState } from "react"
import { motion } from "framer-motion"
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image"
import { ChevronDownSvg, getSocialIcon } from "./Icons"

const ProfileCardGrid = ({ profiles }: any) => {
  return (
    <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-4">
      {profiles.map((profile: any, index: number) => {
        const [isExpanded, setIsExpanded] = useState(false)
        return (
          <motion.div
            key={index}
            layout="position"
            transition={{ duration: 0.0 }}
            className="card h-100 p-4 relative"
          >
            {/* Profile content */}
            <motion.div layout className={`flex gap-4 md:flex-row ${isExpanded ? "flex-col" : "flex-row"}`}>
              {getImage(profile.profile_image) ? (
                <motion.div
                  layout
                  className={`md:basis-1/3 shrink-0 ${isExpanded ? "w-48" : "w-16"}`}
                >
                  <GatsbyImage
                    image={getImage(profile.profile_image) as IGatsbyImageData}
                    alt={`${profile.name} profile picture`}
                    className="rounded-full inline-block flex-1"
                  />
                </motion.div>
              ) : null}
              <div className="self-center w-full">
                {(profile.role || profile.period) ? (
                  <motion.p layout className="font-mono font-bold text-primary uppercase m-0">
                    {profile.role}
                    {(profile.role && profile.period) ? " • " : null}
                    {profile.period}
                  </motion.p>
                ) : null}
                {profile.name ? (
                  <motion.p layout className="2xl:text-3xl text-2xl font-bold m-0">
                    {profile.name}
                  </motion.p>
                ) : null}
                {profile.handle ? (
                  <p className={`font-mono mb-1 ${isExpanded ? "" : "max-md:hidden"}`}>
                    @{profile.handle}
                  </p>
                ) : null}
                {profile.work ? (
                  <p className={`mb-1 ${isExpanded ? "" : "max-md:hidden"}`}>
                    {profile.work}
                  </p>
                ) : null}
                {profile.links ? (
                  <div className={isExpanded ? "" : "max-md:hidden"}>
                    {profile.links.map((link: any, index: number) => {
                      const social = getSocialIcon(link.name)
                      if (!social) return null
                      if (link.link === "") return null
                      if (link.name === "email") link.link = `mailto:${link.link}`
                      return (
                        <a
                          key={index}
                          href={link.link}
                          title={social.display}
                          className="mr-2"
                          target="_blank" rel="noopener noreferrer"
                        >
                          {social.svg}
                        </a>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            </motion.div>
            {profile.bio ? (
              <div className={`flex flex-row mt-4 ${isExpanded ? "" : "max-md:hidden"}`}>
                <p className="m-0">
                  {profile.bio}
                </p>
              </div>
            ) : null}
            {/* Expand/minimize button: only shows on mobile */}
            <span className="absolute top-8 right-4 md:hidden">
              <button title="Expand profile" onClick={() => setIsExpanded(!isExpanded)}>
                <motion.div
                  layout
                  animate={{ rotate: isExpanded ? 180 : 0, transition: { ease: "easeInOut" } }}
                  className="inline-block"
                >
                  <ChevronDownSvg height={32} width={32} />
                </motion.div>
              </button>
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

export default ProfileCardGrid
