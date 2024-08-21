import {
  defineCollection,
  z,
} from 'astro:content';
import { glob } from 'astro/loaders';
import { eventsSchema, meetingsSchema, profilesSchema, publicationsSchema } from '~/content/config';

const meetings = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/meetings' }),
  schema: meetingsSchema,
});

const profiles = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/profiles' }),
  schema: profilesSchema,
});

const events = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/events' }),
  schema: eventsSchema,
});

const publications = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/publications' }),
  schema: publicationsSchema,
});

const pages = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: 'src/pages_md' }),
  schema: () => z.object({
    title: z.string(),
    description: z.string(),
    no_background: z.optional(z.boolean()),
    full_width: z.optional(z.boolean()),
  }),
});

export const collections = {
  'meetings': meetings,
  'profiles': profiles,
  'events': events,
  'publications': publications,
  'pages': pages,
};
