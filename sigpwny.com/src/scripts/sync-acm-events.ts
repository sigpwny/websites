import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { meetingMetadata, type MeetingMetatype } from '../../../_global/utils/meetingMetadata';
import locations from '../locations.json';
import { createICalendarLocation } from '../utils/icalendar';

dayjs.extend(duration);
dayjs.extend(timezone);
dayjs.extend(utc);

const apiUrl = 'https://core.acm.illinois.edu/api/v1';
const calendarTimezone = 'America/Chicago';
const managedBy = 'sigpwny.com';
const dryRun = process.argv.includes('--dry-run');
const includePast = process.argv.includes('--include-past');
const sourceId = process.argv.find((argument) => argument.startsWith('--source-id='))?.slice('--source-id='.length);
const apiKey = process.env.ACM_CORE_API_KEY;

interface SourceEntry {
  id: string;
  slug?: string;
  data: {
    title: string;
    time_start: string;
    duration: string;
    type?: MeetingMetatype;
    featured?: boolean;
    location?: string;
    description?: string;
    links?: Array<{ name: string; url: string }>;
  };
}

interface AcmEventPayload {
  title: string;
  description: string;
  start: string;
  end: string;
  location: string;
  locationLink?: string;
  host: 'SIGPwny';
  featured: boolean;
  rsvpEnabled: boolean;
  metadata: Record<string, string>;
}

interface AcmEvent extends Omit<AcmEventPayload, 'end' | 'metadata'> {
  id: string;
  end?: string;
  metadata?: Record<string, string>;
}

function readBuildOutput(name: 'meetings' | 'events'): SourceEntry[] {
  const file = path.join(process.cwd(), 'dist', name, 'all.json');
  if (!fs.existsSync(file)) {
    throw new Error(`Missing ${file}; build the site before syncing ACM events.`);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8')) as SourceEntry[];
}

function truncateDescription(description: string): string {
  return description.length <= 250 ? description : `${description.slice(0, 247)}...`;
}

function getAcmEventTitle(entry: SourceEntry, kind: 'meeting' | 'event'): string {
  const meetingType = entry.data.type;
  const typeName = kind === 'meeting' && meetingType && meetingType !== 'general'
    ? ` ${meetingMetadata[meetingType].shortName}`
    : '';
  return `SIGPwny${typeName}: ${entry.data.title}`;
}

function toAcmEvent(entry: SourceEntry, kind: 'meeting' | 'event'): AcmEventPayload {
  const start = dayjs(entry.data.time_start).tz(calendarTimezone);
  const end = start.add(dayjs.duration(entry.data.duration));
  const resolvedLocation = createICalendarLocation(locations, entry.data.location);
  const sourceId = `${kind}:${entry.id}`;
  const eventWebsite = entry.data.links?.find((link) => link.name.toLowerCase() === 'website')?.url;
  const moreInfoUrl = kind === 'meeting'
    ? `https://sigpwny.com${entry.slug}`
    : eventWebsite;
  const fallbackDescription = kind === 'meeting'
    ? `${entry.data.title}, a SIGPwny ${entry.data.type ?? 'general'} meeting.`
    : `${entry.data.title}, an event hosted by SIGPwny.`;

  return {
    title: getAcmEventTitle(entry, kind),
    description: truncateDescription(entry.data.description?.trim() || fallbackDescription),
    start: start.format('YYYY-MM-DDTHH:mm:ss'),
    end: end.format('YYYY-MM-DDTHH:mm:ss'),
    location: entry.data.location?.trim() || 'Location TBD',
    ...(resolvedLocation ? {
      locationLink: `https://maps.google.com/?q=${encodeURIComponent(resolvedLocation.title)}`,
    } : {}),
    host: 'SIGPwny',
    featured: false,
    rsvpEnabled: false,
    metadata: {
      managedBy,
      sourceId,
      ...(moreInfoUrl ? { moreInfoURL: moreInfoUrl } : {}),
    },
  };
}

function eventMatches(existing: AcmEvent, desired: AcmEventPayload): boolean {
  const existingMetadata = Object.entries(existing.metadata ?? {}).sort(([a], [b]) => a.localeCompare(b));
  const desiredMetadata = Object.entries(desired.metadata).sort(([a], [b]) => a.localeCompare(b));
  return existing.title === desired.title
    && existing.description === desired.description
    && existing.start === desired.start
    && existing.end === desired.end
    && existing.location === desired.location
    && existing.locationLink === desired.locationLink
    && existing.host === desired.host
    && existing.featured === desired.featured
    && existing.rsvpEnabled === desired.rsvpEnabled
    && JSON.stringify(existingMetadata) === JSON.stringify(desiredMetadata);
}

async function getAcmEvents(): Promise<AcmEvent[]> {
  const query = new URLSearchParams({
    host: 'SIGPwny',
    includeMetadata: 'true',
  });
  if (!includePast) {
    query.set('upcomingOnly', 'true');
  }
  if (apiKey) {
    query.set('ts', Math.floor(Date.now() / 1000).toString());
  }
  const response = await fetch(`${apiUrl}/events?${query}`, {
    headers: apiKey ? { 'X-Api-Key': apiKey } : undefined,
  });
  if (!response.ok) {
    throw new Error(`Failed to retrieve ACM events (${response.status}): ${await response.text()}`);
  }
  return response.json() as Promise<AcmEvent[]>;
}

async function mutateAcmEvent(method: 'POST' | 'PATCH' | 'DELETE', pathname: string, payload?: AcmEventPayload) {
  if (dryRun) {
    return;
  }

  if (!apiKey) {
    throw new Error('ACM_CORE_API_KEY is required to sync ACM events.');
  }

  const response = await fetch(`${apiUrl}${pathname}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  if (!response.ok) {
    throw new Error(`${method} ${pathname} failed (${response.status}): ${await response.text()}`);
  }
}

async function main() {
  if (!dryRun && !apiKey) {
    throw new Error('ACM_CORE_API_KEY is required to sync ACM events.');
  }
  if (includePast && !sourceId) {
    throw new Error('--include-past requires --source-id to prevent an accidental historical bulk import.');
  }

  const now = dayjs();
  const desiredEvents = [
    ...readBuildOutput('meetings').map((entry) => toAcmEvent(entry, 'meeting')),
    ...readBuildOutput('events').map((entry) => toAcmEvent(entry, 'event')),
  ].filter((event) => !sourceId || event.metadata.sourceId === sourceId)
    .filter((event) => includePast || dayjs.tz(event.end, calendarTimezone).isAfter(now));

  if (sourceId && desiredEvents.length !== 1) {
    throw new Error(`Expected one source event for "${sourceId}", found ${desiredEvents.length}.`);
  }

  const desiredBySourceId = new Map(desiredEvents.map((event) => [event.metadata.sourceId, event]));
  if (desiredBySourceId.size !== desiredEvents.length) {
    throw new Error('Multiple upcoming source events have the same ACM source ID.');
  }

  const existingEvents = await getAcmEvents();
  const managedEvents = existingEvents
    .filter((event) => event.metadata?.managedBy === managedBy)
    .filter((event) => !sourceId || event.metadata?.sourceId === sourceId);
  const existingBySourceId = new Map(managedEvents.map((event) => [event.metadata?.sourceId, event]));

  let created = 0;
  let updated = 0;
  let deleted = 0;
  let unchanged = 0;

  for (const [sourceId, desired] of desiredBySourceId) {
    const existing = existingBySourceId.get(sourceId);
    if (!existing) {
      console.log(`${dryRun ? 'Would create' : 'Creating'} ACM event "${desired.title}"`);
      await mutateAcmEvent('POST', '/events', desired);
      created++;
    } else if (!eventMatches(existing, desired)) {
      console.log(`${dryRun ? 'Would update' : 'Updating'} ACM event "${desired.title}"`);
      await mutateAcmEvent('PATCH', `/events/${existing.id}`, desired);
      updated++;
    } else {
      unchanged++;
    }
  }

  for (const existing of managedEvents) {
    const sourceId = existing.metadata?.sourceId;
    if (!sourceId || desiredBySourceId.has(sourceId)) {
      continue;
    }
    console.log(`${dryRun ? 'Would delete' : 'Deleting'} ACM event "${existing.title}"`);
    await mutateAcmEvent('DELETE', `/events/${existing.id}`);
    deleted++;
  }

  console.log(`ACM event sync${dryRun ? ' dry run' : ''}: ${created} create, ${updated} update, ${deleted} delete, ${unchanged} unchanged.`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
