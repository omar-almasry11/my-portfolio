/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,liquid}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"], // Optional: Add specific DaisyUI themes
  },
};