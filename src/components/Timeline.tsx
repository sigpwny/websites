import React from "react"
import { Link as GatsbyLink } from "gatsby"

interface Link {
    href: string
    text: string
}

export interface Event {
    title: string
    date: string
    description: string | JSX.Element
    link?: Link
}

interface Props {
    events: Array<Event>
}

const Timeline = ({ events }: Props) => {

    return (
        <ol className="border-l border-surface1">
            {events.reverse().map((event, index) => (
                <li key={index} className="flex flex-col mb-10 ml-4">
                    <div className="flex flex-row mt-1.5">
                        <div className="w-4 h-4 rounded-full -ml-6 border border-black border-2 bg-surface1"></div>
                        <div className="ml-2 mb-1 text-sm font-normal leading-none text-gray-500">
                            {event.date}
                        </div>
                    </div>
                    <div className="text-lg font-semibold text-white">
                        {event.title}
                    </div>
                    <p className="mb-4 text-base font-normal text-gray-400">{event.description}</p>
                    <div className="flex flex-row">
                    {event.link && (
                        <GatsbyLink to={event.link.href} className="inline-flex items-center 
                        px-4 py-2 text-sm font-medium border
                        rounded-lg focus:z-10 
                        focus:ring-4 focus:outline-none
                        focus:text-blue-700 bg-surface1 text-gray-400 
                        border-2
                        border-gray-600 hover:text-white hover:bg-surface0 focus:ring-background">{event.link.text}</GatsbyLink>
                        )}
                    </div>
                </li>
            ))}
        </ol>
    )
}

export default Timeline