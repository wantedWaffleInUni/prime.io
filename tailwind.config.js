/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "mainBackgroundColor": "#e2b7b7",
        "columnBackgroundColor": "#e7cfcf",
      },
    },
  },
  plugins: [],
};
