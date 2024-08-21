import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import react from "@astrojs/react";
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

// https://astro.build/config
export default defineConfig({
  site: 'https://fallctf.com',
  integrations: [
    mdx({
      gfm: true,
      rehypePlugins: [
        rehypeKatex
      ],
      remarkPlugins: [
        remarkMath
      ],
    }),
    sitemap(),
    tailwind(),
    react(),
  ],
  adapter: netlify(),
  experimental: {
    contentLayer: true,
  },
});