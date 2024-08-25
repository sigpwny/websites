import { z } from 'astro:content';
import { CardImageSchema, ICalDataSchema } from '.';

export const EventSchema = ({ image }) => (
  z.object({
    title: z.string(),
    ical: z.optional(ICalDataSchema()),
    // discord_event: z.object({}),
    time_start: z.coerce.date(),
    duration: z.string().default("PT48H"),
    timezone: z.string().default("Etc/UTC"),
    series: z.string(),
    credit: z.optional(z.array(z.string())),
    sponsors: z.optional(z.array(z.string())),
    location: z.string(),
    description: z.string(),
    card_image: z.optional(CardImageSchema(image)),
    links: z.array(z.object({
      name: z.string(),
      url: z.string(),
    })),
    stats: z.optional(z.array(z.object({
      name: z.string(),
      value: z.string(),
    }))),
  })
)