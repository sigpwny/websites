import { z, type ImageFunction } from 'astro:content';

export const CardImageSchema = (image: ImageFunction) => (
  z.preprocess(
    // If foreground, background, and background_color are all undefined, use placeholder
    (value: any) => ((value.foreground || value.background || value.background_color) ? value : {
      background: "$/assets/placeholder.png",
      alt: "Placeholder image",
    }),
    // Schema for card_image
    z.object({
      foreground: z.optional(image()),
      background: z.optional(image()),
      background_color: z.optional(z.string().regex(/^#[0-9A-F]{6}$/i)),
      alt: z.optional(z.string()),
    })
  )
)