/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kayfabe-black': '#000000',
        'kayfabe-white': '#FFFFFF',
        'kayfabe-cream': '#F5F5F5',
        'kayfabe-gold': '#C9A227',
        'kayfabe-red': '#8B3A3A',
        'kayfabe-gray': {
          dark: '#333333',
          medium: '#666666',
          light: '#CCCCCC',
        }
      },
      fontFamily: {
        'typewriter': ['"Courier New"', 'Courier', 'monospace'],
        'display': ['"Arial Black"', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
