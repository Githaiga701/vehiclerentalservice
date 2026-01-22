/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(210 20% 8%)',
        foreground: 'hsl(210 20% 98%)',
        muted: 'hsl(210 15% 20%)',
        primary: {
          DEFAULT: 'hsl(204 88% 52%)',
          foreground: 'hsl(210 20% 98%)'
        }
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem'
      }
    }
  },
  plugins: []
};

