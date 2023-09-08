import React from "react";
import { Link, graphql } from "gatsby";

import Seo from "../components/Seo";
import { AvatarGroup } from "../components/Profile";
import { CountdownBadge } from "../components/Countdown";
import { TagGroup } from "../components/Tag";
import { Tooltip } from "../components/Tooltip";
import { weekNumber, convertDate, formatSemester } from "../utils/util";
import { PdfSvg, YouTubeSvg } from "../components/Icons";

type Meeting = Queries.MeetingsPageQuery["allMeeting"]["nodes"][0];

interface Props {
  data: Queries.MeetingsPageQuery;
}

export const Head = () => {
  return (
    <Seo
      title="Meetings"
      description="Index of all SIGPwny meetings"
    />
  );
};

const MeetingRow = ({ meeting }: { meeting: Meeting }) => {
  const profiles = meeting.credit_profiles.map((profile, idx) => {
    if (profile) return profile;
    return {
      name: meeting.credit[idx]
    };
  });
  return (
    <li>
      <div className="flex flex-row px-2 py-1 -mx-2 gap-x-4 rounded-lg hover:bg-surface-200">
        <div className="flex flex-row flex-grow lg:flex-grow-0 min-w-0 lg:w-1/2 xl:w-3/5 gap-x-4 items-center justify-content-center">
          <span
            className="hidden sm:flex font-mono min-w-max cursor-default day-tooltip-select"
            data-tooltip-content={convertDate(meeting.time_start, "ddd", meeting.timezone)}
          >
            {convertDate(meeting.time_start, "YYYY-MM-DD", meeting.timezone)}
          </span>
          <CountdownBadge time_start={meeting.time_start} time_close={meeting.time_close} />
          <Link to={`${meeting.slug}`} className="truncate">
            <span>
              <span className="font-mono">Week {weekNumber(meeting.week_number)}</span>: {meeting.title}
            </span>
          </Link>
        </div>
        <div className="hidden lg:flex flex-row lg:flex-grow gap-x-4 truncate">
          {meeting.tags && meeting.tags.length > 0 && (
            <TagGroup tags={meeting.tags.concat()} char_limit={25} tag_limit={3} />
          )}
        </div>
        <div className="hidden md:flex flex-row gap-x-4 min-w-fit truncate">
          <div className="grid grid-cols-3" style={{gridTemplateColumns: `repeat(3, 2rem)`}}>
            <div className="flex items-center justify-items-center">
            </div>
            <div className="flex items-center justify-items-center">
              {meeting.recording && (
                <a
                  href={meeting.recording}
                  className="px-2 link-tooltip-select"
                  aria-label={"Watch video"}
                  data-tooltip-content={"Watch video"}
                >
                  <YouTubeSvg />
                </a>
              )}
            </div>
            <div className="flex items-center justify-items-center">
              {meeting.slides?.publicURL && (
                <a
                  href={meeting.slides.publicURL}
                  className="px-2 link-tooltip-select"
                  aria-label={"Download slides"}
                  data-tooltip-content={"Download slides"}
                >
                  <PdfSvg />
                </a>
              )}
            </div>
          </div>
          <AvatarGroup
            profiles={profiles as ProfileBasicProps[]}
            limit={3}
          />
        </div>
      </div>
      <hr className="border-surface-200" />
    </li>
  );
};

const MeetingsPage = ({ data }: Props) => {
  const meetingsBySemester = data.allMeeting.nodes.reduce(
    (acc, meeting) => {
      const semester = meeting.semester;
      if (!semester) return acc;
      if (acc[semester]) {
        acc[semester].push(meeting);
      } else {
        acc[semester] = [meeting];
      }
      return acc;
    }, {} as {[semester: string]: Meeting[]
  });
  return (
    <section id="meetings" className="pb-8">
      <div className="flex flex-col mx-auto page-width-lg">
        <h1>Meetings</h1>
        <p>
          Our meetings are on Thursdays at 7–8 PM and Sundays at 2–3 PM and are usually located in Siebel CS 1404.&nbsp;
          <br className="hidden lg:block" />
          We will always provide a Zoom meeting link and publish a recording on YouTube afterward.
        </p>
        <div className="panel">
          {Object.entries(meetingsBySemester).map(([semester, meetings]) => (
            <div key={semester} id={semester}>
              <p className="font-bold text-2xl m-0">{formatSemester(semester)}</p>
              <hr className="border-surface-200" />
              <ul className="flex flex-col pb-2">
                {meetings.map((meeting, idx) => (
                  <MeetingRow key={idx} meeting={meeting} />
                ))}
              </ul>
            </div>
          ))}
          <span>
            <Tooltip.Day />
            <Tooltip />
            <Tooltip.Link />
            <Tooltip.Profile />
          </span>
        </div>
      </div>
    </section>
  );
};

export default MeetingsPage;

export const query = graphql`
  query MeetingsPage {
    allMeeting(sort: {time_start: DESC}) {
      nodes {
        title
        time_start
        time_close
        timezone
        week_number
        credit
        credit_profiles {
          name
          profile_image {
            childImageSharp {
              gatsbyImageData(width: 160, aspectRatio: 1)
            }
          }
          handle
          links {
            name
            url
          }
          role
        }
        image {
          path {
            childImageSharp {
              gatsbyImageData(width: 600, placeholder: BLURRED)
            }
          }
          alt
        }
        slides {
          publicURL
        }
        recording
        tags
        semester
        slug
      }
    }
  }
`;
