import { z } from 'astro:content';
import { CardImageSchema, ICalDataSchema } from '.';

export const EventSchema = ({ image }) => (
  z.object({
    title: z.coerce.string(),
    ical: z.optional(ICalDataSchema()),
    // discord_event: z.object({}),
    time_start: z.coerce.date(),
    duration: z.string().duration().catch("PT48H"),
    timezone: z.preprocess(
      (arg) => arg === '' ? undefined : arg,
      z.string().default("Etc/UTC")
    ),
    series: z.coerce.string(),
    credit: z.array(z.coerce.string()).default(["SIGPwny"]),
    sponsors: z.array(z.coerce.string()).default([]),
    location: z.optional(z.coerce.string()),
    description: z.optional(z.coerce.string()),
    card_image: z.optional(CardImageSchema(image)),
    links: z.array(z.object({
      name: z.coerce.string(),
      url: z.coerce.string(),
    })).default([]),
    stats: z.array(z.object({
      name: z.coerce.string(),
      value: z.coerce.string(),
    })).default([]),
  })
)