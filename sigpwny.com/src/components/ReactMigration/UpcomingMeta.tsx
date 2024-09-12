import React from "react"

export const UpcomingMeta = ({ end }: { end: Date }) => {
    const isUpcoming = end > new Date()
    return <div data-tag={isUpcoming ? "upcoming" : "past"} className="hidden" />
}
