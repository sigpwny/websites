import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import {
  MeetingSchema,
  ProfileSchema,
  EventSchema,
  PublicationSchema,
} from '$/schema';

const meetings = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/meetings' }),
  schema: MeetingSchema,
});

const profiles = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/profiles' }),
  schema: ProfileSchema,
});

const events = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/events' }),
  schema: EventSchema,
});

const publications = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/publications' }),
  schema: PublicationSchema,
});

const pages = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: 'src/pages_md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    no_background: z.optional(z.boolean()),
    full_width: z.optional(z.boolean()),
  }),
});

export const collections = {
  meetings,
  profiles,
  events,
  publications,
  pages,
};
