/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Kids palette (参考 chinese-learning-kids 的“奶油底色 + 粉蓝渐变”)
        kid: {
          bg: '#FFFDF4',
          card: '#FFFFFF',
          border: '#F3E9C7',
          text: '#2B2A2A',
          muted: '#6B7280',
          pink: {
            400: '#FF7ABF',
            500: '#FF5FAE',
            600: '#FF3E9A',
          },
          blue: {
            400: '#6BB7FF',
            500: '#4DA3FF',
            600: '#2B8CFF',
          },
          yellow: {
            400: '#FFD166',
            500: '#FFC233',
          },
        },

        // keep existing warm palette for components that still use primary/secondary
        primary: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        secondary: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        neutral: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
      },
      borderRadius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        full: '9999px',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.06)',
        card: '0 14px 34px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
