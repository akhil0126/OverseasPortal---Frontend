/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#eef2ff',
          100: '#dde6ff',
          200: '#c3d0ff',
          300: '#9daeff',
          400: '#7380fc',
          500: '#5055f5',
          600: '#3d38e8',
          700: '#322bcb',
          800: '#2a25a5',
          900: '#1a1663',
          950: '#120f45',
        },
        gold: {
          100: '#fef9e7',
          200: '#fdf2c4',
          300: '#fbe48d',
          400: '#f8d04f',
          500: '#f5bc22',
          600: '#e09b0d',
          700: '#b9770e',
          800: '#975e12',
          900: '#7c4d14',
        },
        ocean: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(18,15,69,0.08)',
        'card-hover': '0 8px 40px 0 rgba(18,15,69,0.14)',
        glow: '0 0 24px rgba(80,85,245,0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { transform: 'translateY(20px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
      },
    },
  },
  plugins: [],
}
