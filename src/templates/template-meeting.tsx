import React from "react"
import { Link, graphql } from "gatsby"

import MeetingSidebar from "../components/MeetingSidebar"
import Seo from "../components/Seo"
import { weekNumber, convertDate, getYouTubeEmbedUrl } from "../utils/util"
import { PdfSvg, YouTubeSvg } from "../components/Icons"

interface Props {
  data: Queries.MeetingTemplateQuery
}

export const Head = ({ data }: Props) => {
  const { curr } = data
  if (!curr) {
    throw new Error(`invalid argument: "curr" meeting is null`)
  }
  return (
    <Seo
      title={curr.title}
      description={curr.semester + " Week " + weekNumber(curr.week_number) +
        " • " + convertDate(curr.time_start, "MMMM DD, YYYY", data.site!.siteMetadata.timezone)
      }
      image={curr.image && curr.image.path ? (
        curr.image.path.childImageSharp?.gatsbyImageData.images.fallback?.src
      ) : undefined}
      video={curr.recording ? (
        getYouTubeEmbedUrl(curr.recording)
      ) : undefined}
      type="article"
    />
  )
}

const MeetingTemplate = ({ data }: Props) => {
  const { curr, prev, next } = data
  if (!curr) {
    throw new Error(`invalid argument: "curr" meeting is null`)
  }
  // cursed typescript hack
  const html_data = (curr.parent as { html: string }).html
  return (
    <>
      <div className="flex flex-row gap-x-4">
        <aside className="xl:w-96 lg:w-80 lg:block hidden sticky">
          <MeetingSidebar />
        </aside>
        <div className="panel w-100 grow">
          <p className="font-mono m-0">
            {curr.semester} Week {weekNumber(curr.week_number)} &bull; {convertDate(curr.time_start, "MMMM DD, YYYY", data.site!.siteMetadata.timezone)}
          </p>
          <h1 className="mb-1">{curr.title}</h1>
          <p>
            Presented by:&nbsp;
            {curr.credit.length > 0 ? (
              curr.credit.map((credit: string, index: number) => (
                <>{credit}{index < curr.credit.length - 1 ? ", " : ""}</>
              ))
            ) : "SIGPwny" }
          </p>
          <div className="grid sm:flex sm:flex-row gap-2 mb-4">
            {curr.slides && curr.slides.publicURL ? (
              <Link className="btn-primary" to={curr.slides.publicURL}>
                <PdfSvg />
                <p className="inline align-middle m-0 ml-2">
                  Download slides
                </p>
              </Link>
            ) : null}
            {curr.recording ? (
              <a className="btn-primary xs:grow sm:grow-0" href={curr.recording}>
                <YouTubeSvg />
                <p className="inline align-middle m-0 ml-2">
                  Watch video
                </p>
              </a>
            ) : null}
          </div>
          {curr.recording ? (
            (() => {
              const url = getYouTubeEmbedUrl(curr.recording)
              return url ? (
                <iframe
                  className="bg-background w-full max-w-2xl aspect-video mx-auto mb-4"
                  allow="encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen={true}
                  src={url}
                />
              ) : null
            })()
          ) : null}
          {curr.parent ? (
            <div
              className="page-content"
              dangerouslySetInnerHTML={{ __html: html_data }}
            />
          ) : null}
        </div>
      </div>
    </>
  )
}

export default MeetingTemplate

export const query = graphql`
  query MeetingTemplate(
    $id: String!
    $prev_id: String
    $next_id: String
  ) {
    curr: meeting(id: { eq: $id }) {
      parent {
        ... on MarkdownRemark {
          html
        }
      }
      title
      time_start
      time_close
      week_number
      credit
      recording
      image {
        path {
          childImageSharp {
            gatsbyImageData(
              width: 600,
              quality: 100,
              placeholder: NONE,
            )
          }
        }
        alt
      }
      semester
      slides {
        base
        publicURL
      }
    }
    prev: meeting(id: { eq: $prev_id }) {
      title
      slug
    }
    next: meeting(id: { eq: $next_id }) {
      title
      slug
    }
    site {
      siteMetadata {
        timezone
      }
    }
  }
`