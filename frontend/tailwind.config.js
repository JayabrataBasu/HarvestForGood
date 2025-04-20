/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
        'inner-light': 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
        'highlight': '0 0 15px rgba(58, 130, 56, 0.3)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      typography: (theme) => ({
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
              letterSpacing: '-0.025em',
            },
            h2: {
              color: 'var(--primary-dark)',
              letterSpacing: '-0.025em',
            },
            h3: {
              color: 'var(--primary-dark)',
              letterSpacing: '-0.025em',
            },
            h4: {
              color: 'var(--primary-dark)',
              letterSpacing: '-0.025em',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              backgroundColor: theme('colors.gray.100'),
              color: theme('colors.gray.800'),
              borderRadius: '0.25rem',
              padding: '0.25rem 0.5rem',
              fontWeight: '400',
              fontSize: '0.875em',
            },
            blockquote: {
              borderLeftColor: 'var(--primary-light)',
              fontStyle: 'normal',
              color: 'var(--foreground)',
              backgroundColor: 'var(--soft-green)',
              padding: '1rem 1.5rem',
              borderRadius: '0 0.5rem 0.5rem 0',
            },
          },
        },
        green: {
          css: {
            '--tw-prose-links': 'var(--primary)',
            '--tw-prose-headings': 'var(--primary-dark)',
          },
        },
      }),
      animation: {
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [
    typography,
  ],
};

export default config;

