import {
  defineCollection,
  z,
} from 'astro:content';
import { glob } from 'astro/loaders';
import { events, meetings, profiles, publications } from '~/content/config';


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
  meetings,
  profiles,
  events,
  publications,
  pages,
};
