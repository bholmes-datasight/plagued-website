/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Reuse Plagued color palette
        plague: {
          black: '#0a0a0a',
          dark: '#0d0d0d',
          grey: '#1a1a1a',
          lighter: '#2a2a2a',
          green: '#00ff00',
          'green-dark': '#00cc00',
          'green-glow': '#00ff0080',
          red: '#8b0000',
          'red-bright': '#cc0000',
          bone: '#f5f5f5',
          mist: '#e0e0e0',
        },
        // Admin-specific status colors
        status: {
          pending: '#f59e0b',      // Amber
          processing: '#3b82f6',   // Blue
          shipped: '#8b5cf6',      // Purple
          delivered: '#10b981',    // Green
          cancelled: '#ef4444',    // Red
        },
      },
      fontFamily: {
        display: ['Oswald', 'Impact', 'sans-serif'],
        body: ['Barlow', 'Helvetica Neue', 'sans-serif'],
        blackletter: ['EnglishTowne', 'serif'],
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
