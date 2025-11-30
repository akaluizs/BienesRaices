/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores Principales
        "naranja": "#FF8C00",
        "rojo-naranja": "#E04A1F",
        "amarillo-dorado": "#FFD700",
        "blanco": "#FFFFFF",
        "negro": "#000000",
        
        // Colores Auxiliares
        "gris-claro": "#f5f5f5",
        "gris-medio": "#e0e0e0",
        "gris-oscuro": "#333333",
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF8C00, #E04A1F, #FFD700)',
        'gradient-cta': 'linear-gradient(135deg, #FF8C00, #E04A1F)',
        'gradient-cta-hover': 'linear-gradient(135deg, #E04A1F, #FF8C00)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        'naranja': '0 4px 12px rgba(255, 140, 0, 0.3)',
        'rojo-naranja': '0 4px 16px rgba(224, 74, 31, 0.4)',
        'card': '0 8px 24px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [], 
}
