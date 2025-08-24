import { z } from 'astro:content';
import { CardImageSchema, ICalDataSchema } from '.';

export const MeetingSchema = ({ image }) => (
  z.object({
    title: z.coerce.string().describe('The title of the meeting.'),
    ical: z.optional(ICalDataSchema()).describe('iCalendar data for the meeting.'),
    // discord_event: z.object({}),
    time_start: z.coerce.date().describe('The date and time the meeting starts.'),
    duration: z.string().duration().catch("PT1H").describe('The duration of the meeting.'),
    type: z.enum(["general", "seminar", "ctf", "purple", "embedded"]).default("general").describe('The type of the meeting.'),
    timezone: z.preprocess(
      (arg) => arg === '' ? undefined : arg,
      z.string().default("America/Chicago").describe('The timezone of the meeting.')
    ),
    week_number: z.preprocess(
      (arg) => arg === '' ? undefined : arg,
      z.optional(z.number().gte(0).lte(52)).describe('The week number of the year.')
    ),
    // authors: z.array(reference('profiles')).default(["org/sigpwny"]),
    credit: z.array(z.coerce.string()).default(["SIGPwny"]).describe('The credits or authors of the meeting.'),
    featured: z.boolean().catch(false).describe('Whether the meeting is featured or not.'),
    location: z.optional(z.coerce.string()).describe('The location of the meeting.'),
    description: z.optional(z.coerce.string()).describe('A brief description of the meeting.'),
    card_image: z.optional(CardImageSchema(image)).describe('An image representing the meeting.'),
    live_video_url: z.preprocess(
      (arg) => arg === '' ? undefined : arg,
      z.optional(z.string().url()).describe('A URL to the live video of the meeting (e.g. Zoom).')
    ),
    slides: z.optional(z.coerce.string()).describe('Relative file path to the slides for the meeting.'),
    recording: z.preprocess(
      (arg) => arg === '' ? undefined : arg,
      z.optional(z.string().url()).describe('A URL to the recording of the meeting (e.g. YouTube).')
    ),
    // assets: z.optional(z.array(z.string())),
    tags: z.array(z.coerce.string()).default([]).describe('Tags associated with the meeting.'),
    difficulty: z.optional(z.enum(["beginner", "intermediate", "advanced"])).describe('The difficulty level of the meeting.')
  })
)
