import React from "react"

import Card from "./Card"

interface Props {
  cards: CardProps[]
}

const CardRow = ({ cards }: Props) => {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      <div className="flex grow">
        {cards[0] ? <Card {...cards[0]} /> : null}
      </div>
      <div className="flex grow">
        {cards[1] ? <Card {...cards[1]} /> : null}
      </div>
      <div className="hidden lg:flex grow">
        {cards[2] ? <Card {...cards[2]} /> : null}
      </div>
      <div className="hidden xl:flex grow">
        {cards[3] ? <Card {...cards[3]} /> : null}
      </div>
      <div className="hidden 2xl:flex grow">
        {cards[4] ? <Card {...cards[4]} /> : null}
      </div>
    </div>
  )
}

export default CardRow