/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,js,liquid,md}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        heading: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',

        // Primary accents
        lapis: {
          DEFAULT: '#2E4A8E',
          light: '#4A6AB0',
          dark: '#1E3266',
        },
        amber: {
          DEFAULT: '#D4952A',
          light: '#E5AC4A',
          dark: '#B07A1E',
        },

        // Neutrals — light
        cream: '#FDFCFA',
        sand: '#F5F1EB',
        sandDark: '#E8E2D9',

        // Neutrals — dark
        oxford: '#000022',
        oxfordLight: '#0D0D2B',
        oxfordLighter: '#1A1A3A',

        // Shared
        slate: {
          DEFAULT: '#5A5A68',
          light: '#7A7A88',
          dark: '#3A3A48',
        },

        coral: '#E07560',
        success: '#4A8E6A',

        // Flat keys for rings / shortcuts (align with lapis / amber)
        primary: '#2E4A8E',
        primaryInverted: '#D4952A',
      },
      textColor: {
        normal: '#000022',
        secondary: '#5A5A68',
        primary: '#2E4A8E',
        inverted: '#FDFCFA',
        invertedSecondary: '#B8B4AE',
        primaryInverted: '#D4952A',
        // Aliases (same hex as secondary / invertedSecondary)
        normalLight: '#5A5A68',
        invertedLight: '#B8B4AE',
      },
      backgroundColor: {
        normal: '#FDFCFA',
        /** Light surface for `.standard-card` (projects, testimonials, services, etc.) */
        card: '#F8F8F8',
        secondary: '#F5F1EB',
        accent: '#2E4A8E',
        accentSecondary: '#D4952A',
        inverted: '#000022',
        invertedSecondary: '#0D0D2B',
        invertedTertiary: '#1A1A3A',
        accentInverted: '#D4952A',
        primary: '#2E4A8E',
        primaryInverted: '#D4952A',
      },
      textDecorationColor: {
        normal: '#000022',
        inverted: '#FDFCFA',
        primary: '#2E4A8E',
        primaryInverted: '#D4952A',
      },
      borderColor: {
        normal: '#E8E2D9',
        light: '#F0EBE3',
        inverted: '#1A1A3A',
        invertedLight: '#2A2A4A',
        normalLight: '#D4CFC6',
      },
      boxShadow: {
        low: '0px 1px 3px rgba(0, 0, 34, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.10), 0px 2px 1px rgba(0, 0, 0, 0.08)',
        medium: '0px 2px 4px rgba(0, 0, 34, 0.1), 0px 3px 6px rgba(0, 0, 0, 0.14)',
        high: '0px 10px 20px rgba(0, 0, 34, 0.1), 0px 6px 6px rgba(0, 0, 0, 0.23)',
        lowInverted: '0px 1px 3px rgba(255, 255, 255, 0.12), 0px 1px 1px rgba(255, 255, 255, 0.04), 0px 2px 1px rgba(255, 255, 255, 0.03)',
        mediumInverted: '0px 3px 6px rgba(255, 255, 255, 0.12), 0px 3px 6px rgba(255, 255, 255, 0.06)',
        highInverted: '0px 10px 20px rgba(255, 255, 255, 0.12), 0px 6px 6px rgba(255, 255, 255, 0.08)',
      },
      typography: (theme) => {
        const headingFont = theme('fontFamily.heading').join(', ');
        return {
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('textColor.normal'),
            '--tw-prose-headings': theme('textColor.normal'),
            h1: { fontFamily: headingFont },
            h2: { fontFamily: headingFont },
            h3: { fontFamily: headingFont },
            h4: { fontFamily: headingFont },
            '--tw-prose-links': theme('textColor.primary'),
            '--tw-prose-bold': theme('textColor.normal'),
            '--tw-prose-counters': theme('textColor.secondary'),
            '--tw-prose-bullets': theme('textColor.primary'),
            '--tw-prose-hr': theme('colors.slate.DEFAULT'),
            '--tw-prose-quotes': theme('textColor.normal'),
            '--tw-prose-quote-borders': theme('colors.lapis.DEFAULT'),
            '--tw-prose-captions': theme('textColor.secondary'),
            '--tw-prose-code': theme('textColor.invertedSecondary'),
            '--tw-prose-pre-code': theme('textColor.primaryInverted'),
            '--tw-prose-pre-bg': theme('backgroundColor.inverted'),
            '--tw-prose-th-borders': theme('borderColor.normalLight'),
            '--tw-prose-td-borders': theme('borderColor.normal'),
          },
        },
        inverted: {
          css: {
            '--tw-prose-body': theme('textColor.inverted'),
            '--tw-prose-headings': theme('textColor.inverted'),
            h1: { fontFamily: headingFont },
            h2: { fontFamily: headingFont },
            h3: { fontFamily: headingFont },
            h4: { fontFamily: headingFont },
            '--tw-prose-links': theme('textColor.primaryInverted'),
            '--tw-prose-bold': theme('textColor.inverted'),
            '--tw-prose-counters': theme('textColor.invertedSecondary'),
            '--tw-prose-bullets': theme('textColor.primaryInverted'),
            '--tw-prose-hr': theme('textColor.invertedSecondary'),
            '--tw-prose-quotes': theme('textColor.inverted'),
            '--tw-prose-quote-borders': theme('textColor.primaryInverted'),
            '--tw-prose-captions': theme('textColor.invertedSecondary'),
            '--tw-prose-code': theme('textColor.primaryInverted'),
            '--tw-prose-pre-code': theme('textColor.normal'),
            '--tw-prose-pre-bg': theme('textColor.inverted'),
            '--tw-prose-th-borders': theme('borderColor.inverted'),
            '--tw-prose-td-borders': theme('borderColor.inverted'),
          },
        },
        };
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
