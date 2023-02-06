import React from "react"
import { GatsbyImage, StaticImage, getImage, IGatsbyImageData } from "gatsby-plugin-image"

import SmartLink from "./SmartLink"

const Card = ({ heading, title, image, link, no_hover }: CardProps) => {
  var card_component = (
    <div className="card h-100 grow use-color-text">
      <div className="aspect-video flex align-middle">
        <div className="m-auto">
          {image && image.path && getImage(image.path) ? (
            <GatsbyImage
              image={getImage(image.path) as IGatsbyImageData}
              alt={image.alt}
            />
          ) : (
            <StaticImage
              src="../images/placeholder.png"
              alt="Placeholder image"
            />
          )}
        </div>
      </div>
      <div className="p-2">
        <p className="line-clamp-1 leading-4 m-0 font-mono font-size-small">
          {heading}
        </p>
        <p className="line-clamp-2 leading-5 mb-1">
          {title}
        </p>
      </div>
    </div>
  )
  if (!no_hover) {
    card_component = (
      <div className="card-hover flex grow">
        {card_component}
      </div>
    )
  }
  if (link) {
    return (
      <SmartLink to={link} className="flex grow">
        {card_component}
      </SmartLink>
    )
  }
  return card_component
}

export default Card