import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 海洋色系
        'ocean-deep': '#1a365d',
        'ocean-blue': '#2b77a3',
        'wave-teal': '#4fd1c7',
        'surf-aqua': '#9decf9',
        // 沙灘色系
        'sand-warm': '#f7fafc',
        'sand-light': '#e2e8f0',
        'sunset-gold': '#fbb040',
        'coral-pink': '#fc8181',
        // 文字色系
        'text-primary': '#2d3748',
        'text-secondary': '#4a5568',
        'text-muted': '#718096',
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;