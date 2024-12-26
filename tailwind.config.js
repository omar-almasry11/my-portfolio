/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,liquid}"], // Adjust paths if needed
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        savoyBlue: '#3d60e2',
        aliceBlue: '#e0ecff',
        oxfordBlue: '#000022',
        ebony: '#515751',
        icterine: '#EDF060',
        taupeGray: '#A39594',
      },
      textColor: {
        normal: '#000022',
        normalLight: '#515751',
        hover: '#3d60e2',
        inverted: 'white',
        invertedLight: 'A39594',
      },
      backgroundColor: {
        normal: 'white',
        inverted: '#000022',
      },
    },
  },
  plugins: [],
};