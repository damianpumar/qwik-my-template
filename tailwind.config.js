/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  daisyui: {
    themes: [
      {
        mytheme: {

          "primary": "#f99b5c",

          "secondary": "#6eead1",

          "accent": "#1ae024",

          "neutral": "#2a293d",

          "base-100": "#f8fafc",

          "info": "#68c2e3",

          "success": "#176e52",

          "warning": "#f7ad5f",

          "error": "#f93462",
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
