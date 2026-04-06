import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'Syne', 'sans-serif'],
        dm: ['var(--font-dm)', 'DM Sans', 'sans-serif'],
      },
      colors: {
        bp: {
          black: '#080808',
          white: '#f4f2ed',
          accent: '#c8f135',
          mid: '#111111',
          mid2: '#161616',
          mid3: '#1d1d1d',
          muted: 'rgba(244,242,237,0.4)',
          dim: 'rgba(244,242,237,0.65)',
        },
      },
    },
  },
  plugins: [],
};

export default config;
