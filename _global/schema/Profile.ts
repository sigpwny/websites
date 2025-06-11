import { z } from 'astro:content';
import { CardImageSchema } from '.';

export const ProfileSchema = ({ image }) => (
  z.object({
    name: z.coerce.string(),
    profile_image: z.optional(image()),
    handle: z.optional(z.coerce.string()),
    bio: z.optional(z.coerce.string()),
    pronouns: z.optional(z.coerce.string()),
    links: z.array(z.object({
      name: z.coerce.string(),
      url: z.coerce.string(),
    })).default([]),
    role: z.optional(z.enum(['admin', 'alum', 'helper', 'member', 'sponsor', 'org'])),
    title: z.optional(z.coerce.string()),
    weight: z.number().catch(0),
    period: z.optional(z.coerce.string()),
    // Sponsor specific fields
    is_workshop_sponsor: z.boolean().catch(false),
    card_image: z.optional(CardImageSchema(image)),
  })
)