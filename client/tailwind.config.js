/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
        gridTemplateColumns: {
            "main": "1fr min(1440px, 95vw) 1fr",
        },
    },
  },
  plugins: [],
}

