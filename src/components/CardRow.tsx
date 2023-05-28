import React from "react"

import Card from "./Card"

interface Props {
  cards: CardProps[]
  maxFour?: boolean
}

const CardRow = ({ cards, maxFour }: Props) => {
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

export default CardRow