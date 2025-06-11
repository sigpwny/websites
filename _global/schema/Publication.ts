import { z } from 'astro:content';
import { CardImageSchema } from '.';

export const PublicationSchema = ({ image }) => (
  z.object({
    title: z.coerce.string(),
    date: z.coerce.date(),
    credit: z.array(z.coerce.string()).default(["SIGPwny"]),
    publication_type: z.enum(['blog', 'paper', 'talk', 'news', 'writeup']).default('blog'),
    publisher: z.optional(z.coerce.string()),
    description: z.optional(z.coerce.string()),
    card_image: z.optional(CardImageSchema(image)),
    primary_link: z.optional(z.object({
      name: z.coerce.string(),
      url: z.string(),
    })),
    links: z.array(z.object({
      name: z.coerce.string(),
      url: z.string(),
    })).default([]),
    tags: z.array(z.coerce.string()).default([]),
  })
)