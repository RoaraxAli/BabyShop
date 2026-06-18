/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/fumadocs-ui/dist/**/*.js',
  ],
  presets: [require('fumadocs-ui/tailwind-plugin').createPreset()],
  theme: {
    extend: {},
  },
  plugins: [],
};
