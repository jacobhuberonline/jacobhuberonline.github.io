import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: { DEFAULT: 'hsl(var(--card) / <alpha-value>)', foreground: 'hsl(var(--foreground) / <alpha-value>)' },
        primary: { DEFAULT: 'hsl(var(--primary) / <alpha-value>)', foreground: 'hsl(var(--primary-foreground) / <alpha-value>)' },
        secondary: { DEFAULT: 'hsl(var(--muted) / <alpha-value>)', foreground: 'hsl(var(--foreground) / <alpha-value>)' },
        accent: { DEFAULT: 'hsl(var(--muted) / <alpha-value>)', foreground: 'hsl(var(--foreground) / <alpha-value>)' },
        muted: { DEFAULT: 'hsl(var(--muted) / <alpha-value>)', foreground: 'hsl(var(--muted-foreground) / <alpha-value>)' },
        destructive: { DEFAULT: '#ef4444', foreground: '#fff' },
        input: 'hsl(var(--border) / <alpha-value>)',
        ring: 'hsl(var(--primary) / <alpha-value>)',
      },
    },
  },
  plugins: [typography],
};

export default config;
