/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#020617", // Deep dark blue/black
        accent: "#38bdf8",  // Cyan/Sky blue
        secondary: "#1e293b" // Slate for cards
      },
      fontFamily: {
        mono: ['"Fira Code"', 'monospace'], // For code
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}