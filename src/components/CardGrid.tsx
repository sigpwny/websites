import React from "react"

import Card from "./Card"

interface Props {
  cards: CardProps[]
}

const CardGrid = ({ cards }: Props) => {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {cards.map((card) => (
        <div className="flex grow">
          <Card {...card} />
        </div>
      ))}
    </div>
  )
}

export default CardGrid