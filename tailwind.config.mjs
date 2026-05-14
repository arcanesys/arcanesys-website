/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: '#18130c',
        paper: {
          DEFAULT: '#faf8f5',
          2: '#f2ede4',
          3: '#e8e0d2',
        },
        muted: '#7a6a58',
        rule: '#c4b898',
        dark: '#0a0e1a',
        indigo: {
          DEFAULT: '#3730a3',
          hover: '#4338ca',
        },
        amber: '#92400e',
        emerald: '#065f46',
        rose: '#9f1239',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Lora"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      maxWidth: {
        content: '1080px',
        prose: '680px',
        hero: '800px',
      },
    },
  },
  plugins: [],
};
