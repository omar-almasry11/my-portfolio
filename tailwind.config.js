/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables dark mode
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
        primaryInverted: '#F7CB15',
        inverted: '#f2f2f2',
        invertedLight: '#A39594',
      },
      backgroundColor: {
        normal: 'white',
        inverted: '#000022',
        primary: '#3d60e2',
        primaryInverted: '#F7CB15',
      },
      textDecorationColor: {
        normal: '#000022',
        inverted: '#f2f2f2',
        primary: '#3d60e2',
        primaryInverted: '#F7CB15',
      },
      borderColor: {
        normal: '#f2f2f2',
        inverted: '#A39594',
      },
      typography: (theme) => ({
        inverted: {
          css: {
            '--tw-prose-body': theme('textColor.inverted'),
            '--tw-prose-headings': theme('textColor.inverted'),
            '--tw-prose-links': theme('textColor.primaryInverted'),
            '--tw-prose-bold': theme('textColor.inverted'),
            '--tw-prose-counters': theme('textColor.invertedLight'),
            '--tw-prose-bullets': theme('textColor.primaryInverted'),
            '--tw-prose-hr': theme('textColor.invertedLight'),
            '--tw-prose-quotes': theme('textColor.invertedLight'),
            '--tw-prose-quote-borders': theme('colors.icterine'),
            '--tw-prose-captions': theme('textColor.invertedLight'),
            '--tw-prose-code': theme('textColor.primaryInverted'),
            '--tw-prose-pre-code': theme('textColor.normal'),
            '--tw-prose-pre-bg': theme('textColor.inverted'),
            '--tw-prose-th-borders': theme('borderColor.inverted'),
            '--tw-prose-td-borders': theme('borderColor.inverted'),
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')], // Adds typography plugin
};
