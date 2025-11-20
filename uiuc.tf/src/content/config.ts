import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { EventSchema } from '../../../_global/schema';

const events = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/events' }),
  schema: (props) => EventSchema(props),
});

export const collections = { events }