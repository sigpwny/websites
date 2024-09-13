import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import react from "@astrojs/react";
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path';
import redirects from './src/redirects.json';

const meetingBase = path.resolve(import.meta.dirname, '../_global/content/meetings/');

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
  cacheDir: './.cache',
  redirects: redirects as any,
  trailingSlash: 'always',
  vite: {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: '../_global/content/meetings/*',
            dest: 'meetings',
            rename: (_name, _ext, path) => {
              return path.replace(meetingBase, '').replace(/(fa|sp)\d{4}/, '')
            }
          },
          {
            src: '../guides/pwnyctf/book/*',
            dest: 'docs'
          }
        ]
      })
    ]
  },
  experimental: {
    contentLayer: true,
  },
});