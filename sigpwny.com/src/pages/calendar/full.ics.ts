import astroConfig from 'astro.config';
import ical from 'ical-generator';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import {
  createICalendarDescription,
  createICalendarLocation,
  createICalendarUID
} from '@/utils/icalendar';
import {
  calculateSemester,
  getMeetings,
} from '@/utils/meetings';
import consts from '@/consts';
import locations from '@/locations.json';
import { getCollection, type CollectionEntry } from "astro:content";

dayjs.extend(duration);
dayjs.extend(utc);


export async function GET() {
  const meetings = await getMeetings();
  const site = astroConfig.site ? new URL(astroConfig.site) : new URL("https://sigpwny.com");
  const ics = ical({
    name: consts.title,
  });
  meetings.forEach((meeting) => {
    const m = meeting.data;
    ics.createEvent({
      id: m.ical?.uid ?? createICalendarUID(
        `meeting-${calculateSemester(m.time_start.toISOString())}-${m.title}`,
        site.hostname
      ),
      sequence: m.ical?.revision ?? 0,
      start: dayjs.utc(m.time_start),
      end: dayjs.utc(m.time_start).add(dayjs.duration(m.duration)),
      summary: m.ical?.summary ?? m.title,
      description: m.ical?.description ?? createICalendarDescription(
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

  const events = await getCollection('events')  as CollectionEntry<'events'>[];
  events.forEach(({ data, slug }) => {
    const { title, description, location, time_start, duration, ical, links } = data;

    const primaryLink = links.find((l: { name: String, url: String }) => ['website'].includes(l.name.toLowerCase())) || null;
    ics.createEvent({
      id: createICalendarUID(`event-${time_start}-${title}`, site.hostname),
      sequence: ical?.revision ?? 0,
      start: dayjs.utc(time_start),
      end: dayjs.utc(time_start).add(dayjs.duration(duration)),
      summary: ical?.summary || title,
      description: ical?.description ?? createICalendarDescription(
        description,
        location,
        new URL(slug, site.href).href,
        ical?.url ?? primaryLink
      ),
      location: createICalendarLocation(locations, location),
      url: ical?.url,
      x: {
        // TODO: Discord event metadata
      },
    });
  })

  return new Response(
    ics.toString(),
  );
}
