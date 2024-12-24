/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,liquid}"], // Adjust paths if needed
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#3d60e2', // Default primary color
          light: '#e0ecff',   // Light variant
        },
        text: {
          DEFAULT: '#080708', // Default text color
          muted: '#707179',   // Muted text color
        },
      },
    },
  },
  plugins: [],
};