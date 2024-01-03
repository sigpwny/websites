/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./src/pages_md/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/layouts/**/*.{js,jsx,ts,tsx}",
    "./src/templates/**/*.{js,jsx,ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--rgb-primary) / <alpha-value>)",
        secondary: "rgb(var(--rgb-secondary) / <alpha-value>)",
        surface: {
          "000": "rgb(var(--rgb-surface-000) / <alpha-value>)",
          "050": "rgb(var(--rgb-surface-050) / <alpha-value>)",
          "100": "rgb(var(--rgb-surface-100) / <alpha-value>)",
          "150": "rgb(var(--rgb-surface-150) / <alpha-value>)",
          "200": "rgb(var(--rgb-surface-200) / <alpha-value>)",
          "250": "rgb(var(--rgb-surface-250) / <alpha-value>)",
          "300": "rgb(var(--rgb-surface-300) / <alpha-value>)",
        },
        text: "rgb(var(--rgb-text) / <alpha-value>)",
        transparent: "transparent",
      },
    },
    container: {
      center: true,
    },
    fontFamily: {
      mono: [
        "Consolas",
        "Monaco",
        "Lucida Console",
        "ui-monospace",
        "SF Mono",
        "SFMono-Regular",
        "Menlo",
        "DejaVu Sans Mono",
        "monospace",
      ],
    },
  },
  plugins: [],
};
