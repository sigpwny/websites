import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import react from "@astrojs/react";
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

import redirects from './src/redirects.json';

// https://astro.build/config
export default defineConfig({
  site: 'https://sigpwny.com',
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
  redirects: redirects as any,
  trailingSlash: 'always',
  vite: {
    assetsInclude: ['**/*.pdf'],
  },
});