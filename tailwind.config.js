/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
    "!./functions/**/*", // Exclude functions directory
    "!./node_modules/**/*", // Exclude node_modules
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
