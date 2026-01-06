/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Plagued colour palette - extracted from artwork
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
          'red-blood': '#990000',
          bone: '#f5f5f5',
          mist: '#e0e0e0',
        },
      },
      fontFamily: {
        // Display font for headers - brutal, metal aesthetic
        display: ['Oswald', 'Impact', 'sans-serif'],
        // Body font - clean and readable
        body: ['Barlow', 'Helvetica Neue', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'noise': "url('/noise.png')",
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'slide-in-left': 'slide-in-left 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.6s ease-out',
        'drip': 'drip 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'mist': 'mist 20s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
            textShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(0, 255, 0, 0.6)',
            textShadow: '0 0 40px rgba(0, 255, 0, 0.6)',
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'drip': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(5px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'mist': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
