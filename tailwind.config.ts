import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2D6BA1',
          'blue-dark': '#1E4E7A',
          gold: '#F4A225',
          'gold-dark': '#C87F10',
          silver: '#8C9EAD',
          'silver-light': '#B8C4CB',
          dark: '#0A0A0A',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
