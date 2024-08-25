import { z } from 'astro:content';
import { CardImageSchema, ICalDataSchema } from '.';

export const MeetingSchema = ({ image }) => (
  z.object({
    title: z.string(),
    ical: z.optional(ICalDataSchema()),
    // discord_event: z.object({}),
    time_start: z.coerce.date(),
    duration: z.string().default("PT1H"),
    timezone: z.string().default("America/Chicago"),
    week_number: z.optional(z.number().gte(0).lte(52)),
    // authors: z.array(reference('profiles')).default(['org/sigpwny']),
    credit: z.array(z.string()).default(["SIGPwny"]),
    featured: z.boolean().default(false),
    location: z.optional(z.string()),
    description: z.optional(z.string()),
    card_image: z.optional(CardImageSchema(image)),
    live_video_url: z.optional(z.string().url()),
    slides: z.optional(z.string()),
    recording: z.optional(z.string().url()),
    // assets: z.optional(z.array(z.string())),
    tags: z.array(z.string()).default([]),
  })
)