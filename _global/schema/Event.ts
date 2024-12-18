import { z } from 'astro:content';
import { CardImageSchema, ICalDataSchema } from '.';

export const EventSchema = ({ image }) => (
  z.object({
    title: z.string(),
    ical: z.optional(ICalDataSchema()),
    // discord_event: z.object({}),
    time_start: z.coerce.date(),
    duration: z.string().duration().catch("PT48H"),
    timezone: z.preprocess(
      (arg) => arg === '' ? undefined : arg,
      z.string().default("Etc/UTC")
    ),
    series: z.string(),
    credit: z.array(z.string()).default(["SIGPwny"]),
    sponsors: z.array(z.string()).default([]),
    location: z.optional(z.string()),
    description: z.optional(z.string()),
    card_image: z.optional(CardImageSchema(image)),
    links: z.array(z.object({
      name: z.string(),
      url: z.string(),
    })).default([]),
    stats: z.array(z.object({
      name: z.string(),
      value: z.string(),
    })).default([]),
  })
)