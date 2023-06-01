import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"

type Publication = Queries.PublicationSidebarQuery["allPublication"]["publications"][0]

const PublicationSidebar = () => {
  const data = useStaticQuery(graphql`
    query PublicationSidebar {
        allPublication(sort: {date: DESC}) {
            publications: nodes {
              title
              credit
              publication_type
              publisher
              date
              formatted_date: date(formatString: "YYYY-MM-DD")
              slug
            }
        }
    }
  `)

    const publications : Publication[] = data.allPublication.publications
    return (
        <div className="panel-p-0 sticky top-4 overflow-hidden rounded-xl py-4">
            <div className="px-4 flex flex-col h-[75vh] overflow-y-auto custom-scrollbar">
                {publications.map((publication) => (
                    <div key={publication.slug} className="flex flex-col pb-2">
                        <Link
                            key={publication.slug}
                            to={`${publication.slug}`}
                            className="truncate"
                            activeClassName="font-bold"
                        >
                            <span className="font-mono">{publication.formatted_date}</span>: {publication.title}
                        </Link>
                    </div>
                ))}
        </div>
        </div>
    )
}

export default PublicationSidebar