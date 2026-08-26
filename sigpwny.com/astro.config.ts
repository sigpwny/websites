import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
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
  compressHTML: true,
  markdown: {
    processor: unified({
      gfm: true,
      rehypePlugins: [rehypeKatex],
      remarkPlugins: [remarkMath],
    }),
  },
  integrations: [
    mdx(),
    sitemap(),
    react(),
  ],
  output: 'static',
  cacheDir: './.cache',
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Helvetica Neue',
      cssVariable: '--font-helvetica-neue',
      fallbacks: ['Helvetica', 'Arial', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/HelveticaNeue-Light.woff2'],
            weight: 300,
            style: 'normal',
          },
          {
            src: ['./src/assets/fonts/HelveticaNeue-Regular.woff2'],
            weight: 400,
            style: 'normal',
          },
          {
            src: ['./src/assets/fonts/HelveticaNeue-RegularItalic.woff2'],
            weight: 400,
            style: 'italic',
          },
          {
            src: ['./src/assets/fonts/HelveticaNeue-Medium.woff2'],
            weight: 500,
            style: 'normal',
          },
          {
            src: ['./src/assets/fonts/HelveticaNeue-Bold.woff2'],
            weight: 700,
            style: 'normal',
          },
        ],
      },
    },
  ],
  redirects: redirects as any,
  trailingSlash: 'always',
  vite: {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: normalize('../_global/content/meetings/**/*'),
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
