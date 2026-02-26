import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        volcanic: {
          950: '#0a0a0a',
          900: '#141414',
          850: '#1a1a1a',
          800: '#1c1c1c',
          700: '#262626',
          600: '#404040',
          500: '#737373',
          400: '#a3a3a3',
          300: '#d4d4d4',
        },
        lava: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
          light: '#fbbf24',
          glow: 'rgba(245, 158, 11, 0.08)',
          subtle: 'rgba(245, 158, 11, 0.15)',
        }
      },
      fontFamily: {
        'display': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Source Sans 3', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;