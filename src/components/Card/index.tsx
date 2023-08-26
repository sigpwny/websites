import React from "react"
import { GatsbyImage, StaticImage, getImage, IGatsbyImageData } from "gatsby-plugin-image"

import "./card.css"
import SmartLink from "../SmartLink"
import { weekNumber, convertDate } from "../../utils/util"

export function createCard(
  content: CardMeetingProps | CardEventProps | CardPublicationProps | CardSponsorProps
): CardProps {
  if ("meeting" in content) {
    const { meeting, timezone } = content as CardMeetingProps;
    return ({
      heading: meeting.semester + " Week " + weekNumber(meeting.week_number) + " • " + convertDate(meeting.time_start, "YYYY-MM-DD", timezone),
      title: meeting.title,
      image: meeting.image, // TODO: REPLACE
      link: meeting.slug
    });
  } else if ("event" in content) {
    const { event, timezone } = content as CardEventProps;
    return ({
      heading: convertDate(event.time_start, "YYYY-MM-DD", timezone),
      title: event.title,
      card_image: event.card_image,
      link: event.slug
    });
  } else if ("publication" in content) {
    const { publication } = content as CardPublicationProps;
    return ({
      heading: publication.publication_type.toUpperCase() +
        (publication.publisher ? " • " + publication.publisher : ""),
      title: publication.title,
      card_image: publication.card_image,
      link: publication.slug
    });
  } else if ("sponsor" in content) {
    const { sponsor } = content as CardSponsorProps;
    return ({
      card_image: sponsor.card_image,
    });
  }
  throw new Error("invalid argument: content");
}

export const Card = ({ heading, title, image, overlay_image, card_image, link }: CardProps) => {
  const card_component = (
    <div className="card">
      <div className="aspect-video grid pointer-events-none select-none">
        {(image || overlay_image || card_image) ? (
          <>
            {/* TODO: keep track if alt has already been placed */}
            {/* TODO: REPLACE */}
            {image?.path && getImage(image.path) && (
              <GatsbyImage
                image={getImage(image.path) as IGatsbyImageData}
                alt={image.alt}
                className="row-span-full col-span-full"
              />
            )}
            {/* TODO: REPLACE */}
            {overlay_image?.path && getImage(overlay_image.path) && (
              <div className="row-span-full col-span-full overflow-hidden p-4 grid items-center">
                {/*
                  I spent a while to figure out that the combination of:
                  - parent div: overflow-hidden
                  - child div: max-h-full
                  - child img: scale-down
                  will resize the image in a nice way... I have no idea
                  how it works.
                */}
                <GatsbyImage
                  image={getImage(overlay_image.path) as IGatsbyImageData}
                  alt={overlay_image.alt}
                  className="max-h-full"
                  objectFit="scale-down"
                />
              </div>
            )}

            {(card_image?.background_image?.childImageSharp || card_image?.background?.publicURL) ?
              (
                card_image.background_image?.childImageSharp ? (
                  <GatsbyImage
                    image={getImage(card_image.background_image) as IGatsbyImageData}
                    alt={card_image.alt ?? ""}
                    className="row-span-full col-span-full"
                  />
                ) : (
                  <img
                    src={card_image.background?.publicURL}
                    alt={card_image.alt ?? ""}
                    className="row-span-full col-span-full"
                  />
                )
              ) : (
                card_image?.background_color ? (
                  <div className="row-span-full col-span-full" style={{ backgroundColor: card_image.background_color }} />
                ) : (
                  undefined
                )
              )
            }
            {(card_image?.foreground_image?.childImageSharp || card_image?.foreground?.publicURL) ?
              (
                <div className="row-span-full col-span-full overflow-hidden p-[5%] grid items-center">
                  {
                    card_image.foreground_image?.childImageSharp ? (
                      <GatsbyImage
                        image={getImage(card_image.foreground_image) as IGatsbyImageData}
                        alt={card_image.alt ?? ""}
                        className="max-h-full"
                        objectFit="scale-down"
                      />
                    ) : (
                      <div className="flex h-full w-full overflow-hidden">
                        <img
                          src={card_image.foreground?.publicURL}
                          alt={card_image.alt ?? ""}
                          className="object-contain mx-auto"
                        />
                      </div>
                    )
                  }
                </div>
              ) : (
                undefined
              )
            }
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
      <SmartLink to={link} className="card-hover flex grow rounded-xl">
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

export const CardGrid = ({ cards }: { cards: CardProps[] }) => {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {cards.map((card, idx) => (
        <div key={idx} className="flex grow">
          <Card {...card} />
        </div>
      ))}
    </div>
  )
}

export const CardRow = ({ cards, maxFour }: { cards: CardProps[], maxFour?: boolean }) => {
  return (
    <div className={"grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" + (maxFour ? "" : " 2xl:grid-cols-5")}>
      <div className="grow flex">
        {cards[0] ? <Card {...cards[0]} /> : null}
      </div>
      <div className="grow flex">
        {cards[1] ? <Card {...cards[1]} /> : null}
      </div>
      <div className="grow hidden lg:flex">
        {cards[2] ? <Card {...cards[2]} /> : null}
      </div>
      <div className="grow hidden xl:flex">
        {cards[3] ? <Card {...cards[3]} /> : null}
      </div>
      <div className={"grow hidden" + (maxFour ? "" : " 2xl:flex")}>
        {cards[4] ? <Card {...cards[4]} /> : null}
      </div>
    </div>
  )
}
