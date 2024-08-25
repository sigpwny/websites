import { z } from 'astro:content';
import { CardImageSchema } from '.';

export const ProfileSchema = ({ image }) => (
  z.object({
    name: z.string(),
    profile_image: z.optional(image()),
    handle: z.optional(z.string()),
    bio: z.optional(z.string()),
    pronouns: z.optional(z.string()),
    links: z.array(z.object({
      name: z.string(),
      url: z.string(),
    })).default([]),
    role: z.optional(z.enum(['admin', 'alum', 'helper', 'member', 'sponsor', 'org'])),
    title: z.optional(z.string()),
    weight: z.number().default(0),
    period: z.optional(z.string()),
    // Sponsor specific fields
    is_workshop_sponsor: z.boolean().default(false),
    card_image: z.optional(CardImageSchema(image)),
  })
)