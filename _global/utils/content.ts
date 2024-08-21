import { meetingsSchema, profilesSchema, eventsSchema, publicationsSchema } from '../content/config';
import { defineCollection, z, type ImageFunction } from 'astro:content';
import { glob } from 'astro/loaders';

// Importing from content layer
export const meetings = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/meetings' }),
  schema: meetingsSchema,
});

export const profiles = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/profiles' }),
  schema: profilesSchema,
});

export const events = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/events' }),
  schema: eventsSchema,
});

export const publications = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/publications' }),
  schema: publicationsSchema,
});