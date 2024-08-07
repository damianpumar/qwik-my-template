/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  daisyui: {
    themes: [
      "lofi",
      "black",
    ],

  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
