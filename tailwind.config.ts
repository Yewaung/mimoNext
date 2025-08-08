import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0FF0FC', // Main primary color
          50: '#f0fffe',
          100: '#ccfffe',
          200: '#9afffd',
          300: '#5cfffa',
          400: '#1ef4f0',
          500: '#0FF0FC',
          600: '#04bab8',
          700: '#0a9492',
          800: '#0f7574',
          900: '#126161',
        },
        secondary: {
          DEFAULT: '#8A2BE2', // Main secondary color
          50: '#f4f0ff',
          100: '#ebe4ff',
          200: '#d9cdff',
          300: '#bea6ff',
          400: '#9c75ff',
          500: '#8A2BE2',
          600: '#7c22cc',
          700: '#6b1bb0',
          800: '#59188f',
          900: '#4a1574',
        },
        accent: {
          DEFAULT: '#FFD700', // Main accent color
          50: '#fffdf0',
          100: '#fffacc',
          200: '#fff499',
          300: '#ffe95c',
          400: '#ffd91f',
          500: '#FFD700',
          600: '#e6b800',
          700: '#cc8400',
          800: '#a36700',
          900: '#855400',
        },
        background: 'rgba(20, 20, 30, 0.85)',
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.2)',
          light: 'rgba(255, 255, 255, 0.15)',
          medium: 'rgba(255, 255, 255, 0.25)',
          dark: 'rgba(255, 255, 255, 0.1)',
        },
        glassBorder: 'rgba(255, 255, 255, 0.3)',
        text: {
          DEFAULT: '#F0F8FF',
          muted: 'rgba(240, 248, 255, 0.8)',
          disabled: 'rgba(240, 248, 255, 0.5)',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      borderRadius: {
        default: '0.75rem',
        card: '1.25rem',
        button: '9999px',
      },
      backdropBlur: {
        glass: '10px',
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
        'glass-hover': '0 8px 40px rgba(0, 0, 0, 0.15)',
        neon: '0 0 20px rgba(15, 240, 252, 0.3)',
        'neon-hover': '0 0 30px rgba(15, 240, 252, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-neon': 'pulseNeon 2s infinite',
        float: 'float 3s ease-in-out infinite',
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
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(15, 240, 252, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(15, 240, 252, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropFilter: {
        glass: 'blur(10px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Custom plugin for glassmorphism utilities
    function ({ addUtilities }: any) {
      const newUtilities = {
        '.glass': {
          background: 'rgba(255, 255, 255, 0.2)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          'box-shadow': '0 4px 30px rgba(0, 0, 0, 0.1)',
        },
        '.glass-hover': {
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.25)',
            'box-shadow': '0 8px 40px rgba(0, 0, 0, 0.15)',
          },
        },
        '.text-shadow': {
          'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.3)',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;
