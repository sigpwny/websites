import consts from '@/consts';
import { defineCollection, reference, z, type ImageFunction } from 'astro:content';
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

const icalDataSchema = z.object({
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
});

const cardImageSchema = (image: ImageFunction) => z.preprocess(
  // If foreground, background, and background_color are all undefined, use placeholder
  (value: any) => ((value.foreground || value.background || value.background_color) ? value : {
    background: "@/assets/placeholder.png",
    alt: "Placeholder image",
  }),
  // Schema for card_image
  z.object({
    // foreground: z.optional(image().refine((img) => img.width >= 600, {
    //   message: "Image width must be at least 600px",
    // })),
    // background: z.optional(image().refine((img) => img.width >= 600, {
    //   message: "Image width must be at least 600px",
    // })),
    foreground: z.optional(image()),
    background: z.optional(image()),
    background_color: z.optional(z.string().regex(/^#[0-9A-F]{6}$/i)),
    alt: z.optional(z.string()),
  }
));

const meetings = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    ical: z.optional(icalDataSchema),
    // discord_event: z.object({}),
    time_start: z.coerce.date(),
    duration: z.string().default("PT1H"), // ISO 8601 durations
    timezone: z.string().default(consts.timezone), // IANA timezone to display on site (maybe remove this and show local timezone instead)
    week_number: z.optional(z.number().gte(0).lte(52)), // TODO: auto-compute this by default?
    // authors: z.array(reference('profiles')).default(['org/sigpwny']), // TODO: set default to SIGPwny
    credit: z.array(z.string()).default(["SIGPwny"]),
    featured: z.boolean().default(false),
    location: z.optional(z.string()),
    description: z.optional(z.string()),
    card_image: z.optional(cardImageSchema(image)),
    live_video_url: z.optional(z.string().url()),
    slides: z.optional(z.string()), // TODO: this is a path to a file, validate it exists
    recording: z.optional(z.string().url()),
    // assets: z.optional(z.array(z.string())),
    tags: z.array(z.string()).default([]),
    // semester: z.optional(z.string()), // TODO: validate this is a valid semester
    // slug: z.string(),
  }),
});

const profiles = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    name: z.string(),
    profile_image: z.optional(image()),
    // profile_image: image().transform(
      //   async (img: ImageMetadata) => await getImage({
        //     src: img,
        //     height: 300,
        //     width: 300,
    //     heights: [64, 300],
    //     widths: [64, 300],
    //   }),
    // ), // TODO: refine to be square
    handle: z.optional(z.string()),
    bio: z.optional(z.string()),
    pronouns: z.optional(z.string()),
    links: z.optional(z.array(z.object({
      name: z.string(),
      url: z.string(),
    }))),
    role: z.optional(z.enum(['admin', 'alum', 'helper', 'member', 'sponsor', 'org'])),
    title: z.optional(z.string()),
    weight: z.number().default(0),
    period: z.optional(z.string()),
    // Sponsor specific fields
    is_active_sponsor: z.optional(z.boolean()),
    card_image: z.optional(cardImageSchema(image)),
  }),
});

export const collections = {
  'meetings': meetings,
  'profiles': profiles
};
