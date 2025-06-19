import { z } from 'astro:content';
import { CardImageSchema } from '.';

export const AlbumSchema = ({ image }) => (
  z.object({
    title: z.string(),
    description: z.optional(z.string()),
    card_image: z.optional(CardImageSchema(image)),
  })
)