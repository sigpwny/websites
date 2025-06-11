import { z } from 'astro:content';

export const ICalDataSchema = () => (
  z.object({
    uid: z.coerce.string(),
    revision: z.number(),
    summary: z.coerce.string(),
    description: z.optional(z.coerce.string()),
    location: z.optional(z.object({
      title: z.optional(z.coerce.string()),
      address: z.optional(z.coerce.string()),
      radius: z.optional(z.number()),
      geo: z.object({
        lat: z.number(),
        lon: z.number()
      }),
    })),
    url: z.optional(z.string().url()),
  })
)