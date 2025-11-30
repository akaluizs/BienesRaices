/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "xela-navy": "var(--xela-navy)",
        "cerro-verde": "var(--cerro-verde)",
        "niebla": "var(--niebla)",
        "arena": "var(--arena)",
        "granito": "var(--granito)",
      },
    },
  },
  plugins: [], 
}
