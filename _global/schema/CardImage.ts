import { z, type ImageFunction } from 'astro:content';

export const CardImageSchema = (image: ImageFunction) => (
  // Schema for card_image
  z.object({
    foreground: z.optional(image()),
    background: z.optional(image()),
    background_color: z.optional(z.string().regex(/^#[0-9A-F]{6}$/i)),
    alt: z.optional(z.coerce.string()),
  })
)