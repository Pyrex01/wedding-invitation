/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Tiro Devanagari Hindi"', 'serif'],
        body: ['"Poppins"', 'sans-serif']
      },
      colors: {
        mehndi: '#365d37',
        marigold: '#f4a300',
        sindoor: '#c0172f',
        cream: '#fff7e8',
        peacock: '#146b78'
      },
      boxShadow: {
        glow: '0 0 45px rgba(244, 163, 0, 0.25)'
      },
      keyframes: {
        rise: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.06)' }
        }
      },
      animation: {
        rise: 'rise 700ms ease-out both',
        pulseSoft: 'pulseSoft 3.2s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
