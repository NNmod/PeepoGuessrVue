/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      aspectRatio: {
        '7/2': '7 / 2',
      },
      fontFamily: {
        'futuraPTHeavy': ['Futura PT Heavy', 'sans-serif']
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
}

