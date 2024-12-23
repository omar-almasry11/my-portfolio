/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,liquid}"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};