/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0B1220', card: '#1B2A4A', mid: '#162032', light: '#243556' },
        gold: { DEFAULT: '#D4AF37', dim: '#9C8329', muted: 'rgba(212,175,55,0.7)' },
        cream: '#F5F0E6',
        paper: '#f4f4f0',
      },
      fontFamily: {
        display: ['Spectral', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
