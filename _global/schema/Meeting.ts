import { z } from 'astro:content';
import { CardImageSchema, ICalDataSchema } from '.';

export const MeetingSchema = ({ image }) => (
  z.object({
    title: z.coerce.string(),
    ical: z.optional(ICalDataSchema()),
    // discord_event: z.object({}),
    time_start: z.coerce.date(),
    duration: z.string().duration().catch("PT1H"),
    type: z.enum(["general", "seminar", "ctf", "purple", "embedded"]).default("general"),
    timezone: z.preprocess(
      (arg) => arg === '' ? undefined : arg,
      z.string().default("America/Chicago")
    ),
    week_number: z.preprocess(
      (arg) => arg === '' ? undefined : arg,
      z.optional(z.number().gte(0).lte(52))
    ),
    // authors: z.array(reference('profiles')).default(['org/sigpwny']),
    credit: z.array(z.coerce.string()).default(["SIGPwny"]),
    featured: z.boolean().catch(false),
    location: z.optional(z.coerce.string()),
    description: z.optional(z.coerce.string()),
    card_image: z.optional(CardImageSchema(image)),
    live_video_url: z.preprocess(
      (arg) => arg === '' ? undefined : arg,
      z.optional(z.string().url())
    ),
    slides: z.optional(z.coerce.string()),
    recording: z.preprocess(
      (arg) => arg === '' ? undefined : arg,
      z.optional(z.string().url())
    ),
    // assets: z.optional(z.array(z.string())),
    tags: z.array(z.coerce.string()).default([]),
  })
)
