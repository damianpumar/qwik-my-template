/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  daisyui: {
    themes: [
      "lofi"
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
