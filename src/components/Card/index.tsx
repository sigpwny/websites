import React from "react"
import { GatsbyImage, StaticImage, getImage, IGatsbyImageData } from "gatsby-plugin-image"

import "./card.css"
import SmartLink from "../SmartLink"

const Card = ({ heading, title, image, link }: CardProps) => {
  var card_component = (
    <div className="card h-100 grow use-color-text">
      <div className="aspect-video flex align-middle">
        {image && image.path && getImage(image.path) ? (
          <GatsbyImage
            image={getImage(image.path) as IGatsbyImageData}
            alt={image.alt}
          />
        ) : (
          <StaticImage
            src="./placeholder.png"
            alt="Placeholder image"
          />
        )}
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
  if (link) {
    return (
      <SmartLink to={link} className="card-hover flex grow">
        {card_component}
      </SmartLink>
    )
  }
  return (
    <div className="flex-grow">
      {card_component}
    </div>
  )
}

export default Card