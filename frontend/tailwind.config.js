/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff',
          '90': '#c01e1e',
        },
        destructive: {
          DEFAULT: '#b91c1c',
          foreground: '#ffffff',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      }
    },
  },
  plugins: [],
}