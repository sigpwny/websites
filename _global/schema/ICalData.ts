import { z } from 'astro:content';

export const ICalDataSchema = () => (
  z.object({
    uid: z.string(),
    revision: z.number(),
    summary: z.string(),
    description: z.optional(z.string()),
    location: z.optional(z.object({
      title: z.optional(z.string()),
      address: z.optional(z.string()),
      radius: z.optional(z.number()),
      geo: z.object({
        lat: z.number(),
        lon: z.number()
      }),
    })),
    url: z.optional(z.string().url()),
  })
)