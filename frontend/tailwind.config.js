export default {
  // This tells Tailwind which files to scan for class names (JSX/TSX files)
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scan all files in src/ for Tailwind classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
