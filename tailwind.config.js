/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./public/index.html", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      primary: {
          50: '#f5f7fa',
          100: '#e4e9f2',
          200: '#c9d3e1',
          300: '#9fb3c8',
          400: '#6e88a7',
          500: '#4b6584', // Couleur principale
          600: '#3a506b',
          700: '#2d3e57',
          800: '#1e2a3a',
          900: '#0f1721',
        },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};