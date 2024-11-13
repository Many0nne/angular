/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      animation: {
        blink: 'blink 2s ease-in-out infinite', // Animation clignotante
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.1 },
        },
      },
    },
  },
  plugins: [],
}