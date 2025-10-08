/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Define custom font
      },
      colors: {
        // Defining primary colors to match the app theme (Red/Recovery)
        primary: {
          DEFAULT: '#dc2626', // Tailwind red-600
          foreground: '#ffffff',
          '90': '#c01e1e', // Tailwind red-700
        },
        destructive: {
          DEFAULT: '#b91c1c', // Tailwind red-700
          foreground: '#ffffff',
        }
      }
    },
  },
  plugins: [],
}