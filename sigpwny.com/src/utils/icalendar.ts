import crypto from 'crypto';
import type { ICalLocation } from "ical-generator";

export function createICalendarUID(uniq_id: string, domain: string) {
  const hash = crypto.createHash('sha256').update(uniq_id).digest('hex');
  return `${hash}@${domain}`;
};

export function createICalendarDescription(
  description?: string,
  location?: string,
  page_url?: string,
  video_url?: string
) {
  const str_page_url = page_url ? `${page_url}\n\n` : "";
  const str_location = location ? `Location: ${location}\n\n` : "";
  const str_description = description ? `${description}\n\n` : "";
  const str_video_url = video_url ? `----( Video Call )----\n${video_url}\n---===---\n\n` : "";
  return `${str_page_url}${str_location}${str_description}${str_video_url}`.trim();
}

export function createICalendarLocation(locations: any[], init_loc?: string) {
  if (!init_loc) return undefined;
  if (locations.length !== 0) {
    const full_loc = locations.find((location) =>
      location.matches.some((match: any) => new RegExp(match).test(init_loc))
    );
    if (full_loc) {
      return {
        title: full_loc.title,
        address: full_loc.address,
        radius: full_loc.radius ?? 100.0,
        geo: full_loc.geo,
      } as ICalLocation;
    }
  }
  return {
    title: init_loc
  } as ICalLocation;
}