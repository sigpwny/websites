import { z } from 'astro:content';
import { CardImageSchema } from '.';

export const PublicationSchema = ({ image }) => (
  z.object({
    title: z.string(),
    credit: z.array(z.string()),
    publisher: z.string(),
    publication_type: z.enum(['blog', 'paper', 'talk', 'news']),
    date: z.coerce.date(),
    card_image: z.optional(CardImageSchema(image)),
    primary_link: z.object({
      name: z.string(),
      url: z.string(),
    }),
    links: z.optional(z.array(z.object({
      name: z.string(),
      url: z.string(),
    }))),
    tags: z.optional(z.array(z.string())),
  })
)