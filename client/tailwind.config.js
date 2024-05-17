/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {},
      fontFamily: {
        Rubik : ["Rubik Moonrocks", "sans-serif"],
        creepster: ["Creepster", "system-ui"]

      },
  },
  plugins: [
    flowbite.plugin(),
    require('tailwind-scrollbar'),
  ],
}