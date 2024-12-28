/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
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
        primary: '#3d60e2',
        primaryInverted: '#EDF060',
        inverted: '#f2f2f2',
        invertedLight: '#A39594',
      },
      backgroundColor: {
        normal: 'white',
        inverted: '#000022',
        primary: '#3d60e2',
        primaryInverted: '#EDF060',
      },
    },
  },
  plugins: [],
};