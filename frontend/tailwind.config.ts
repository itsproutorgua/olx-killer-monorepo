import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  prefix: '',
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    screens: {
      xs: '375px',
      md: '768px',
      xl: '1440px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '11px',
        md: '110px',
        xl: '80px',
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      background: '#F9FAFB',
      foreground: '#111827',
      border: '#E5E7EB',
      primary: {
        50: '#EEF4FF',
        100: '#E0EAFF',
        200: '#C6D7FE',
        300: '#A4BCFD',
        400: '#8098F9',
        500: '#6172F3',
        600: '#444CE7',
        700: '#3538CD',
        800: '#2D31A6',
        900: '#292C6D',
      },
      gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
        950: '#030712',
      },
      error: {
        50: '#FEF3F2',
        100: '#FEE4E2',
        200: '#FECDCA',
        300: '#FDA29B',
        400: '#F97066',
        500: '#F04438',
        600: '#D92D20',
        700: '#B42318',
        800: '#912018',
        900: '#7A271A',
      },
    },

    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      boxShadow: {
        'custom-purple': '0 4px 12px 0 rgba(97, 62, 234, 0.5)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none' /* IE and Edge */,
          'scrollbar-width': 'none' /* Firefox */,
        },
        '.scrollbar-hide::-webkit-scrollbar': {
          display: 'none' /* Chrome, Safari, Opera */,
        },
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    },
  ],
} satisfies Config

export default config
