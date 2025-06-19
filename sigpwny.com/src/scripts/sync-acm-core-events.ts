import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import advanced from 'dayjs/plugin/advancedFormat';
import { createICalendarUID } from '@/utils/icalendar';
import { meetingMetadata } from '$/utils/meetingMetadata';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(advanced);

const site = new URL("https://sigpwny.com");

function getEnv(key: string, defaultValue?: string) {
  const value = process.env[key];
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  } else if (value === undefined) {
    return defaultValue;
  }
  return value;
}

const ACM_CORE_API_URI = getEnv('ACM_CORE_API_URI', 'https://core.aws.qa.acmuiuc.org/api/v1');
const ACM_CORE_API_KEY = getEnv('ACM_CORE_API_KEY') as string;

async function main() {
  const fetchMeetings = async () => {
    const meetingsPath = path.join(__dirname, '..', '..', 'dist', 'meetings', 'all.json');
    if (fs.existsSync(meetingsPath)) {
      const data = fs.readFileSync(meetingsPath, 'utf8');
      return JSON.parse(data);
    }
  }

  const fetchEvents = async () => {
    const eventsPath = path.join(__dirname, '..', '..', 'dist', 'events', 'all.json');
    if (fs.existsSync(eventsPath)) {
      const data = fs.readFileSync(eventsPath, 'utf8');
      return JSON.parse(data);
    }
  }

  const currentTime = dayjs()

  const meetings = await fetchMeetings();
  const upcomingMeetings = meetings.map((meeting : any) => {
    return {
      ...meeting,
      data: {
        ...meeting.data,
        time_start: dayjs(meeting.data.time_start).tz(meeting.data.timezone),
        time_end: dayjs(meeting.data.time_start).tz(meeting.data.timezone).add(dayjs.duration(meeting.data.duration)),
      }
    }
  }).filter((meeting: any) => meeting.data.time_start > currentTime)
  .filter((meeting: any) => meeting.data.featured);

  const events = await fetchEvents();
  const upcomingEvents = events.map((event : any) => {
    return {
      ...event,
      data: {
        ...event.data,
        time_start: dayjs(event.data.time_start).tz(event.data.timezone),
        time_end: dayjs(event.data.time_start).tz(event.data.timezone).add(dayjs.duration(event.data.duration)),
      }
    }
  }).filter((event: any) => event.data.time_start > currentTime);

  // Transform our data into ACM core events schema
  const localAcmCoreEvents = upcomingMeetings.map((meeting: any) => {
    return {
      title: meeting.data.title,
      description: meeting.data.description ?? "A SIGPwny meeting",
      start: meeting.data.time_start.format("YYYY-MM-DDTHH:mm:ss"),
      end: meeting.data.time_end.format("YYYY-MM-DDTHH:mm:ss"),
      location: meeting.data.location ?? "N/A",
      // locationLink: meeting.data.location
      host: "SIGPwny",
      featured: false,
      metadata: {
        iCalUID: meeting.data.ical?.uid ?? createICalendarUID(
          `meeting-${meeting.data.semester}-${meeting.data.title}`,
          site.hostname
        )
      }
    }
  }).concat(upcomingEvents.map((event: any) => {
    return {
      title: event.data.title,
      description: event.data.description ?? "A SIGPwny event",
      start: event.data.time_start.format("YYYY-MM-DDTHH:mm:ss"),
      end: event.data.time_end.format("YYYY-MM-DDTHH:mm:ss"),
      location: event.data.location ?? "N/A",
      // locationLink: meeting.data.location
      host: "SIGPwny",
      featured: false,
      metadata: {
        iCalUID: event.data.ical?.uid ?? createICalendarUID(
          `event-${event.data.series}-${event.data.title}`,
          site.hostname
        )
      }
    }
  }));

  console.log(`Found ${localAcmCoreEvents.length} events on local build`);

  // Get ACM core events from API
  const request_url = `${ACM_CORE_API_URI}/events?` + new URLSearchParams({
    upcomingOnly: "true",
    host: "SIGPwny",
    ts: dayjs().unix().toString(),
    includeMetadata: "true",
  });
  console.log(`Fetching events from ACM core: ${request_url}`);
  const response = await fetch(request_url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch events from ACM core: ${response.statusText}`);
  }
  const remoteAcmCoreEvents = await response.json();
  console.log(`Found ${remoteAcmCoreEvents.length} events on remote`);

  // Compare our events to the ACM core events
  // If event.metadata.iCalUID matches between local and remote and there are changes, then update the event in ACM core using remote's event.id (post to /events/:id)
  // If the event does not exist in ACM core, create a new event using the event data (post to /events without an id)
  // Ignore events which do not have metadata.iCalUID or the host is not "SIGPwny"
  const eventsToCreate = localAcmCoreEvents.filter((localEvent: any) => {
    return !remoteAcmCoreEvents.some((remoteEvent: any) => {
      return remoteEvent.metadata?.iCalUID === localEvent.metadata.iCalUID && remoteEvent.host === "SIGPwny";
    });
  });
  const eventsToUpdate = localAcmCoreEvents.filter((localEvent: any) => {
    return remoteAcmCoreEvents.some((remoteEvent: any) => {
      return (
        remoteEvent.metadata?.iCalUID === localEvent.metadata.iCalUID &&
        remoteEvent.host === "SIGPwny" &&
        (
          remoteEvent.title !== localEvent.title ||
          remoteEvent.description !== localEvent.description ||
          remoteEvent.start !== localEvent.start ||
          remoteEvent.end !== localEvent.end ||
          remoteEvent.location !== localEvent.location ||
          remoteEvent.featured !== localEvent.featured
        )
      );
    });
  });

  console.log(`Creating ${eventsToCreate.length} new events...`);
  console.log(`Updating ${eventsToUpdate.length} events...`);
  console.log(`Skipping ${localAcmCoreEvents.length - eventsToCreate.length - eventsToUpdate.length} events...`);

  throw new Error("Skipping event creation...")

  // Send API requests
  // Create new events
  for (const event of eventsToCreate) {
    const response = await fetch(`${ACM_CORE_API_URI}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': ACM_CORE_API_KEY,
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      // log the request to be curled
      const requestBody = JSON.stringify(event);
      console.log(`curl -X POST ${ACM_CORE_API_URI}/events -H "Content-Type: application/json" -H "Authorization: Bearer ${ACM_CORE_API_KEY}" -d '${requestBody}'`);
      throw new Error(`Failed to create event ${event.title}: ${response.statusText}`);
    } else {
      console.log(`Created event ${event.title}`);
    }
  }
  // Update existing events
  for (const event of eventsToUpdate) {
    const remoteEvent = remoteAcmCoreEvents.find((remoteEvent: any) => {
      return remoteEvent.metadata.iCalUID === event.metadata.iCalUID && remoteEvent.host === "SIGPwny";
    });
    if (!remoteEvent) {
      console.log(`Could not find remote event for ${event.title}`);
      continue;
    }
    const response = await fetch(`${ACM_CORE_API_URI}/events/${remoteEvent.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': ACM_CORE_API_KEY,
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      throw new Error(`Failed to update event ${event.title}: ${response.statusText}`);
    } else {
      console.log(`Updated event ${event.title}`);
    }
  }
}

main()