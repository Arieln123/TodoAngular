/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors:{
        primary:  "#8718",
        "background-100": "#1A1A1A",
        "background-200": "#292929",
        "background-300": "#404040",
        "background-400": "#5B5B5B",
      }
    },
  },
  plugins: [],
}