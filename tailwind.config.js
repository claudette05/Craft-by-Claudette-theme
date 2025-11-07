/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./my-vibe-theme/**/*.{php,js}", // Scan all PHP and JS files in the theme for Tailwind classes
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Integrate Poppins here
      },
    },
  },
  plugins: [],
}