/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",   // ⭐ 一定要是相对当前目录的 ./src
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
