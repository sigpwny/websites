import { z } from 'astro:content';
import { CardImageSchema } from '.';

export const EventSchema = ({ image }) => (
  z.object({
    title: z.string(),
    series: z.string(),
    description: z.string(),
    time_start: z.coerce.date(),
    time_close: z.coerce.date(),
    credit: z.optional(z.array(z.string())),
    location: z.string(),
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