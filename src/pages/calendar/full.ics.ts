import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import ical from 'ical-generator';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import {
  createICalendarDescription,
  createICalendarLocation,
  createICalendarUID
} from '@/lib/icalendar';
import {
  calculateSemester
} from '@/lib/meetings';
import consts from '@/consts';
import locations from '@/locations.json';

dayjs.extend(duration);
dayjs.extend(utc);


export async function GET(context: APIContext) {
  const meetings = await getCollection('meetings');
  const ics = ical({
    name: consts.title,
  });
  meetings.forEach((meeting) => {
    const m = meeting.data;
    ics.createEvent({
      id: m.ical?.uid ?? createICalendarUID(
        `meeting-${calculateSemester(m.time_start.toISOString())}-${m.title}`,
        context.site?.hostname ?? "sigpwny.com"
      ),
      sequence: m.ical?.revision ?? 0,
      start: dayjs.utc(m.time_start),
      end: dayjs.utc(m.time_start).add(dayjs.duration(m.duration)),
      summary: m.ical?.summary ?? m.title,
      description: m.ical?.description ?? createICalendarDescription(
        m.description,
        m.location,
        context.site?.toString(),
        m.live_video_url
      ),
      location: createICalendarLocation(locations, m.location),
      url: m.ical?.url,
      x: {
        // TODO: Discord event metadata
      },
    });
  });
  return new Response(
    ics.toString()
  );
}
