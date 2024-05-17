/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {

      fontFamily:{
        cairo: "Cairo",
        montserrat: "'Montserrat', sans-serif",
      }
    },
  },
  plugins: [require('preline/plugin')],
}