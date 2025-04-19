import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          light: "var(--primary-light)",
          dark: "var(--primary-dark)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          light: "var(--accent-light)",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        "gray-light": "var(--gray-light)",
        "gray-medium": "var(--gray-medium)",
        "soft-green": "var(--soft-green)",
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 15px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'xl': '1rem',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--foreground)',
            a: {
              color: 'var(--primary)',
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              transition: 'border-color 0.2s ease',
              '&:hover': {
                color: 'var(--primary-dark)',
                borderColor: 'var(--primary)',
              },
            },
            h1: {
              color: 'var(--primary-dark)',
            },
            h2: {
              color: 'var(--primary-dark)',
            },
            h3: {
              color: 'var(--primary-dark)',
            },
            h4: {
              color: 'var(--primary-dark)',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config;
