import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  prefix: '',
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
      border: 'hsl(var(--border))', //#d9d9d9
      input: 'hsl(var(--input))', //
      background: 'hsl(var(--background))', //#fafafa
      foreground: 'hsl(var(--foreground))', //#333333
      primary: {
        DEFAULT: 'hsl(var(--primary))', //#292c6b
        foreground: 'hsl(var(--primary-foreground))', //#fafafa
        gray: 'var(--primary-gray)',
      },
      secondary: {
        500: {
          DEFAULT: 'hsl(var(--secondary))', //#f1f5f9
          foreground: 'hsl(var(--secondary-foreground))', //#0f1729
        },
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))',
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))', //#d9d9d9
        foreground: 'hsl(var(--muted-foreground))', //#fafafa
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))', //#565de1
        foreground: 'hsl(var(--accent-foreground))', //#fafafa
      },
      purple: {
        light: '#EEE3FF',
        dark: '#7F56D9',
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))',
      },
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))',
      },
      black: '#000000',
      gray: {
        50: '#f9fafb',
        100: '#f9f9f9',
        150: '#e8e8e8',
        200: '#dddddd',
        400: '#a3a3a3',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // borderRadius: {
      //   lg: 'var(--radius)',
      //   md: 'calc(var(--radius) - 20px)',
      //   sm: 'calc(var(--radius) - 35px)',
      // },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
