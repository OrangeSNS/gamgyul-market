import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#F26A2A',
          50: '#FEF0E9',
          100: '#FDE0D3',
          200: '#FBC1A7',
          300: '#F8A17A',
          400: '#F5824E',
          500: '#F26A2A',
          600: '#D45820',
          700: '#A84418',
          800: '#7C3211',
          900: '#502009',
        },
      },
      maxWidth: {
        mobile: '480px',
      },
    },
  },
  plugins: [],
} satisfies Config
