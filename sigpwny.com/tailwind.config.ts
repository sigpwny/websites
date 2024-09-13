/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        pwny: {
          'green': 'rgb(var(--rgb-pwny-green) / <alpha-value>)',
          'lgreen': 'rgb(var(--rgb-pwny-lgreen) / <alpha-value>)',
          'dgreen': 'rgb(var(--rgb-pwny-dgreen) / <alpha-value>)',
          'red': 'rgb(var(--rgb-pwny-red) / <alpha-value>)',
          'orange': 'rgb(var(--rgb-pwny-orange) / <alpha-value>)',
          'yellow': 'rgb(var(--rgb-pwny-yellow) / <alpha-value>)',
          'blue': 'rgb(var(--rgb-pwny-blue) / <alpha-value>)',
          'purple': 'rgb(var(--rgb-pwny-purple) / <alpha-value>)',
        },
        primary: 'rgb(var(--rgb-primary) / <alpha-value>)',
        secondary: 'rgb(var(--rgb-secondary) / <alpha-value>)',
        surface: {
          '000': 'rgb(var(--rgb-surface-000) / <alpha-value>)',
          '050': 'rgb(var(--rgb-surface-050) / <alpha-value>)',
          '100': 'rgb(var(--rgb-surface-100) / <alpha-value>)',
          '150': 'rgb(var(--rgb-surface-150) / <alpha-value>)',
          '200': 'rgb(var(--rgb-surface-200) / <alpha-value>)',
          '250': 'rgb(var(--rgb-surface-250) / <alpha-value>)',
          '300': 'rgb(var(--rgb-surface-300) / <alpha-value>)',
        },
        text: 'rgb(var(--rgb-text) / <alpha-value>)',
        transparent: 'transparent',
      },
    },
    container: {
      center: true,
    },
    fontFamily: {
      mono: [
        'Consolas',
        'Monaco',
        '"Lucida Console"',
        'ui-monospace',
        '"SF Mono"',
        'SFMono-Regular',
        'Menlo',
        '"DejaVu Sans Mono"',
        'monospace',
      ],
      vga: [
        '"IBM VGA 8x16"',
        'Consolas',
        'Monaco',
        '"Lucida Console"',
        'ui-monospace',
        '"SF Mono"',
        'SFMono-Regular',
        'Menlo',
        '"DejaVu Sans Mono"',
        'monospace',
      ],
    },
  },
  plugins: [],
}
