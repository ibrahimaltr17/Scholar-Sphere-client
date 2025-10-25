/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // or 'media', but 'class' works with theme toggle
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"], // Make sure dark theme is included
  },
};
