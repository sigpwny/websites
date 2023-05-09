import React from "react"
import { GatsbyImage, StaticImage, getImage, IGatsbyImageData } from "gatsby-plugin-image"

import "./card.css"
import SmartLink from "../SmartLink"

const Card = ({ heading, title, image, overlay_image, link }: CardProps) => {
  var card_component = (
    <div className="card h-100 grow use-color-text">
      <div className="aspect-video grid">
        {(image || overlay_image) ? (
          <>
            {image && image.path && getImage(image.path) && (
              <GatsbyImage
                image={getImage(image.path) as IGatsbyImageData}
                alt={image.alt}
                className="row-span-full col-span-full"
              />
            )}
            {overlay_image && overlay_image.path && getImage(overlay_image.path) && (
              <div className="row-span-full col-span-full overflow-hidden p-4 grid items-center">
                {/* I spent a while to figure out that the combination of:
                    - parent div: overflow-hidden
                    - child div: max-h-full
                    - child img: scale-down
                    will resize the image in a nice way... I have no idea
                    how it works.*/}
                  <GatsbyImage
                    image={getImage(overlay_image.path) as IGatsbyImageData}
                    alt={overlay_image.alt}
                    className="max-h-full"
                    objectFit="scale-down"
                  />
              </div>
            )}
          </>
        ) : (
          <StaticImage
            src="./placeholder.png"
            alt="Placeholder image"
          />
        )}
      </div>
      {(title || heading) && (
        <div className="p-2">
          {heading && (
            <p className="line-clamp-1 leading-4 m-0 font-mono font-size-small">
              {heading}
            </p>
          )}
          {title && (
            <p className="line-clamp-2 leading-5 mb-1">
              {title}
            </p>
          )}
        </div>
      )}
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