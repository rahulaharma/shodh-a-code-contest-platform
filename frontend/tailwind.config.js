/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        brand: {
          50: '#ecf7ff',
          100: '#d5edff',
          200: '#abd8ff',
          300: '#81c2ff',
          400: '#57acff',
          500: '#2d96ff',
          600: '#0b78e6',
          700: '#055bb4',
          800: '#024081',
          900: '#01264f',
        },
        surface: {
          DEFAULT: '#0b1120',
          foreground: '#f8fafc',
          muted: '#1f2937',
        },
        success: '#22c55e',
        warning: '#f97316',
        danger: '#ef4444',
      },
      boxShadow: {
        card: '0 25px 50px -12px rgba(15, 23, 42, 0.45)',
      },
    },
  },
  plugins: [],
}
