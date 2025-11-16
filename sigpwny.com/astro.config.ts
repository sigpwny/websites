import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import react from "@astrojs/react";
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import path from 'node:path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { normalizePath } from 'vite';
import redirects from './src/redirects.json';

function normalize(filePath: string) {
  return normalizePath(path.resolve(import.meta.dirname, filePath));
}

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
            src: normalize('../_global/content/meetings/*'),
            dest: 'meetings',
            rename: (_name, _ext, path) => {
              return normalizePath(path.replace(meetingBase, '').replace(/(fa|sp)\d{4}/, ''))
            }
          }
        ]
      }),
      tailwindcss()
    ]
  },
});