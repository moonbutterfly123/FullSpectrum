import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wiki: {
          bg: "hsl(var(--background))",
          card: "hsl(var(--background))",
          ink: "hsl(var(--foreground))",
          muted: "hsl(var(--muted-foreground))",
          accent: "hsl(var(--primary))",
          secondary: "hsl(var(--secondary))",
          border: "hsl(var(--border))",
          sidebar: "hsl(var(--muted))",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        heading: ["var(--font-display)", "Georgia", "serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        "7xl": "80rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
