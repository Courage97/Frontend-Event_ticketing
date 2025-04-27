/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0f0fe',
          200: '#baddfd',
          300: '#84c5fb',
          400: '#46a6f7',
          500: '#2186eb',
          600: '#1668cb',
          700: '#1554a7',
          800: '#164789',
          900: '#183c72',
        },
        secondary: {
          50: '#f3f2ff',
          100: '#e9e8ff',
          200: '#d4d0ff',
          300: '#b7acff',
          400: '#9580ff',
          500: '#7b59fb',
          600: '#6e3cef',
          700: '#5d2bd8',
          800: '#4d25b4',
          900: '#41238e',
        },
        accent: {
          50: '#fff8f0',
          100: '#fff0e0',
          200: '#ffdfbc',
          300: '#ffc889',
          400: '#ffa546',
          500: '#ff8c1a',
          600: '#ff6b0f',
          700: '#e14c00',
          800: '#ba3d0a',
          900: '#97350f',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f0f5fa',
          200: '#e1e8f0',
          300: '#cad5e0',
          400: '#91a4b7',
          500: '#61758a',
          600: '#445668',
          700: '#304254',
          800: '#1e2a3a',
          900: '#111927',
        },
        success: {
          50: '#ecfdf3',
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          50: '#fffaeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        heading: ['Sora', 'system-ui', 'sans-serif'],
        display: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #1668cb, #2186eb)',
        'secondary-gradient': 'linear-gradient(135deg, #6e3cef, #7b59fb)',
        'accent-gradient': 'linear-gradient(135deg, #ff6b0f, #ff8c1a)',
        'dark-gradient': 'linear-gradient(135deg, #111927, #304254)',
        'soft-gradient': 'linear-gradient(135deg, #f0f5fa, #e1e8f0)',
        'glass-light': 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.3))',
        'glass-dark': 'linear-gradient(135deg, rgba(30,42,58,0.7), rgba(30,42,58,0.3))',
        'ticket-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'soft-sm': '0 2px 4px rgba(11, 20, 26, 0.05), 0 1px 2px rgba(11, 20, 26, 0.1)',
        'soft-md': '0 4px 6px rgba(11, 20, 26, 0.05), 0 2px 4px rgba(11, 20, 26, 0.1)',
        'soft-lg': '0 10px 15px rgba(11, 20, 26, 0.05), 0 4px 6px rgba(11, 20, 26, 0.1)',
        'soft-xl': '0 20px 25px rgba(11, 20, 26, 0.05), 0 10px 10px rgba(11, 20, 26, 0.04)',
        'soft-2xl': '0 25px 50px rgba(11, 20, 26, 0.15)',
        'inner-highlight': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'ticket': '0 4px 8px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'md': '6px',
        'lg': '10px',
        'xl': '14px',
        '2xl': '20px',
        '3xl': '24px',
      },
      animation: {
        'badge-pulse': 'badge-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'ticket-shimmer': 'ticket-shimmer 1.5s infinite linear',
      },
      keyframes: {
        'badge-pulse': {
          '50%': { opacity: '.6' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'ticket-shimmer': {
          '0%': { backgroundPosition: '-468px 0' },
          '100%': { backgroundPosition: '468px 0' }
        }
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}