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
import { meetingTypes } from '@/utils/meetingMetadata';
import consts from '@/consts';
import locations from '@/locations.json';
import { getCollection, type CollectionEntry } from "astro:content";
import type { APIRoute } from 'astro';

dayjs.extend(duration);
dayjs.extend(utc);

// https://web.archive.org/web/20140418004051/http://dzone.com/snippets/calculate-all-combinations
var combine = function(a: String[]) {
  var fn = function(n: number, src: String[], got: String[], all: String[][]) {
    if (n == 0) {
      if (got.length > 0) {
        all[all.length] = got;
      }
      return;
    }

    for (var j = 0; j < src.length; j++) {
      fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
    }
  }
  var all: String[][] = [];
  for (var i=0; i < a.length; i++) {
    fn(i, a, [], all);
  }
  all.push(a);
  return all;
}

export async function getStaticPaths() {
  // Generate each meeting kind, and then have an 'all' path
  // ['general', 'events', 'purple'] should have all combinations
  const combinations = combine(meetingTypes);
  const urlCombinations = combinations.map(c => c.sort());
  
  urlCombinations.push(['all']);

  return urlCombinations.map((type) => {
    return {
      params: {
        type: type.join('-'),
        includes: JSON.stringify(type[0] === 'all' ? meetingTypes : type), // this allows us to pass more metadata
      },
    }
  })
}

export const GET: APIRoute = async ({params, request}) => {
  const includes: String[] = JSON.parse(params.includes || '[]'); 

  const meetings = await getMeetings();
  const filteredMeetings = meetings.filter((meeting) => includes.includes(meeting.data.type || 'general'));
  const site = astroConfig.site ? new URL(astroConfig.site) : new URL("https://sigpwny.com");
  const ics = ical({
    name: consts.title,
  });
  filteredMeetings.forEach((meeting) => {
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
      description: e.ical?.description ?? createICalendarDescription(
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

  return new Response(
    ics.toString(),
  );
}
