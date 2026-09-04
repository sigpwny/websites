import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { EventSchema, ProfileSchema } from '../../../_global/schema';

const events = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/events' }),
  schema: (props) => EventSchema(props),
});

const profiles = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/profiles' }),
  schema: (props) => ProfileSchema(props),
});

export const collections = { events, profiles };