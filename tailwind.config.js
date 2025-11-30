/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdecd3',
          200: '#fbd5a5',
          300: '#f8b76d',
          400: '#f59332',
          500: '#f2750a',
          600: '#e35a05',
          700: '#bc4208',
          800: '#95350d',
          900: '#782e0e',
        },
        leather: {
          50: '#fdf8f3',
          100: '#fbf0e6',
          200: '#f6e0cc',
          300: '#f0c9a3',
          400: '#e7a86f',
          500: '#dd8a3d',
          600: '#d1722a',
          700: '#ad5a24',
          800: '#8a4723',
          900: '#6f3b1f',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
