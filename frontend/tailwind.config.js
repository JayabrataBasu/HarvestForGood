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
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: '#059669',
              '&:hover': {
                color: '#047857',
              },
            },
            h1: {
              color: '#1f2937',
            },
            h2: {
              color: '#1f2937',
            },
            h3: {
              color: '#1f2937',
            },
            h4: {
              color: '#1f2937',
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
            },
          },
        },
        green: {
          css: {
            '--tw-prose-links': theme('colors.green.600'),
            '--tw-prose-headings': theme('colors.gray.800'),
          },
        },
      }),
    },
  },
  plugins: [
    typography,
  ],
};

export default config;

