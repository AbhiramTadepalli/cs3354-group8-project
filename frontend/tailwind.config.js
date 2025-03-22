/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/index.html",],
  theme: {
    backgroundSize: {
      'auto': 'auto',
      'cover': 'cover',
      'contain': 'contain',
      '50%': '50%',
      '100': '200%',
    },
    extend: {
      colors: {
        orange_clr: '#F6B586',
        dark_pink_clr: '#F14696',
        light_pink_clr: '#F3A4BD',
        light_grey_color: '#D9D9D9',
        background_clr: '#F8F1EB',
      },
    },
  },
  plugins: [],
}

