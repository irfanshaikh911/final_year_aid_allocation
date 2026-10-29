/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1F4E8C',
          50: '#EEF5FF',
          100: '#D8E8FB',
          200: '#AFCDF2',
          300: '#81B0E5',
          400: '#4E86C8',
          500: '#1F4E8C',
          600: '#173F75',
          700: '#11325F',
          800: '#0D2649',
          900: '#071A33',
        },
        saffron: {
          DEFAULT: '#FF9933',
          50: '#FFF5E8',
          100: '#FFE4B8',
          200: '#FFCB80',
          300: '#FFB248',
          400: '#FF9933',
          500: '#E6821A',
          600: '#CC6C0A',
          700: '#A85600',
          800: '#854400',
          900: '#623200',
        },
        india: {
          green: '#138808',
          'green-light': '#1CAD0A',
          'green-dark': '#0E6606',
          red: '#D32F2F',
          'red-light': '#EF5350',
          'red-dark': '#B71C1C',
          white: '#FFFFFF',
          chakra: '#000080',
        },
        surface: {
          DEFAULT: '#F6F8FB',
          50: '#FFFFFF',
          100: '#F6F8FB',
          200: '#EAF0F7',
          300: '#D8E2EF',
          400: '#B8C7DA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(31,78,140,0.08), 0 1px 2px rgba(31,78,140,0.06)',
        'card-hover': '0 4px 12px rgba(31,78,140,0.12), 0 2px 6px rgba(31,78,140,0.08)',
        'nav': '0 2px 8px rgba(31,78,140,0.18)',
        'sidebar': '2px 0 8px rgba(31,78,140,0.14)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
