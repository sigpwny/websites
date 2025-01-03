import astroConfig from 'astro.config';
import ical from 'ical-generator';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import {
  createICalendarDescriptionAppleCalendar,
  createICalendarLocation,
  createICalendarUID,
  getCalendarName
} from '@/utils/icalendar';
import { getMeetings } from '@/utils/meetings';
import locations from '@/locations.json';
import { getCollection, type CollectionEntry } from "astro:content";
import type { InferGetStaticParamsType, InferGetStaticPropsType } from 'astro';
import type { MeetingMetatype } from '$/utils/meetingMetadata';
dayjs.extend(duration);
dayjs.extend(utc);

import { getStaticPaths } from './generic.ics';
export { getStaticPaths } from './generic.ics';

type Params = InferGetStaticParamsType<typeof getStaticPaths>;
type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET = async ({ props } : {
  params: Params,
  props: Props,
  request: Request,
}) => {
  const includes: MeetingMetatype[] = props.includes as MeetingMetatype[];

  const meetings = await getMeetings();
  const filteredMeetings = meetings.filter((meeting) => includes?.includes(meeting.data.type || 'general'));
  const site = astroConfig.site ? new URL(astroConfig.site) : new URL("https://sigpwny.com");
  const ics = ical({
    name: getCalendarName(includes),
  });
  filteredMeetings.forEach((meeting) => {
    const m = meeting.data;
    ics.createEvent({
      id: m.ical?.uid ?? createICalendarUID(
        `meeting-${m.semester}-${m.title}`,
        site.hostname
      ),
      sequence: m.ical?.revision ?? 0,
      start: dayjs.utc(m.time_start),
      end: dayjs.utc(m.time_start).add(dayjs.duration(m.duration)),
      summary: m.ical?.summary ?? m.title,
      description: m.ical?.description ?? createICalendarDescriptionAppleCalendar(
        m.description,
        m.location,
        new URL(meeting.slug, site.href).href,
        m.ical?.url ?? m.recording ?? m.live_video_url
      ),
      location: createICalendarLocation(locations, m.location),
      url: m.ical?.url,
      x: {
        // TODO: Discord event metadata
      },
    });
  });

  if (includes.includes('general')) {
    const events = await getCollection('events') as CollectionEntry<'events'>[];
    events.forEach((event) => {
      const e = event.data;
      const primaryLink = e.links.find((l: { name: String, url: String }) => ['website'].includes(l.name.toLowerCase()));
      // TODO: Instead of linking to the website, link to the event page on the base website, e.g. https://fallctf.com/2024/
      ics.createEvent({
        id: e.ical?.uid ?? createICalendarUID(`event-${e.series}-${e.title}`, site.hostname),
        sequence: e.ical?.revision ?? 0,
        start: dayjs.utc(e.time_start),
        end: dayjs.utc(e.time_start).add(dayjs.duration(e.duration)),
        summary: e.ical?.summary ?? e.title,
        description: e.ical?.description ?? createICalendarDescriptionAppleCalendar(
          e.description,
          e.location,
          primaryLink?.url,
          undefined
        ),
        location: createICalendarLocation(locations, e.location),
        url: e.ical?.url,
        x: {
          // TODO: Discord event metadata
        },
      });
    })
  }

  return new Response(
    ics.toString(),
  );
}
