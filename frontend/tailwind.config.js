/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'bry-blue': '#0066CC',
        'bry-dark': '#1a1a1a',
        'bry-gray': '#6b7280',
      },
    },
  },
  plugins: [],
}
