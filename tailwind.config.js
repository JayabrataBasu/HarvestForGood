module.exports = {
  // ...existing config
  plugins: [
    require('@tailwindcss/typography'),
    // ...other plugins
  ],
  theme: {
    extend: {
      // ...existing theme extensions
      typography: {
        DEFAULT: {
          css: {
            a: { 
              color: '#059669',
              '&:hover': { color: '#047857' }
            },
            h1: { color: '#1f2937' },
            h2: { color: '#1f2937' },
            h3: { color: '#1f2937' },
            h4: { color: '#1f2937' },
          }
        }
      }
    }
  }
}
