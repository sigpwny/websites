import {
  defineCollection,
  z,
} from 'astro:content';
import { glob } from 'astro/loaders';
import {
  MeetingSchema,
  ProfileSchema,
  EventSchema,
  PublicationSchema,
  AlbumSchema,
} from '$/schema';

const meetings = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/meetings' }),
  schema: (props) => MeetingSchema(props),
});

const profiles = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/profiles' }),
  schema: (props) => ProfileSchema(props),
});

const events = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/events' }),
  schema: (props) => EventSchema(props),
});

const publications = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/publications' }),
  schema: (props) => PublicationSchema(props),
});

const albums = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.mdx', base: '../_global/content/albums' }),
  schema: (props) => AlbumSchema(props),
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
  meetings,
  profiles,
  events,
  publications,
  albums,
  pages,
};
