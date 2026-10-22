import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:         '#6759A2',
        'primary-dark':  '#453A78',
        'primary-night': '#2E2751',
        'primary-lav':   '#A99FD0',
        'primary-mist':  '#EDEAF6',
        accent:          '#0B7D7B',
        'accent-mist':   '#E3F7F6',
        sky:             '#8CD0F4',
        'blue-link':     '#1668A8',
        'blue-mist':     '#E7F4FC',
        ink:             '#1C1B2E',
        slate:           '#4A4660',
        'gray-text':     '#6E6985',
        'gray-rule':     '#928DA6',
        'gray-light':    '#F4F3F8',
        border:          '#E2DFEC',
        success:         '#0E7A50',
        'success-mist':  '#E6FAF4',
        warning:         '#8F5500',
        'warning-mist':  '#FEF5E6',
        error:           '#C42B30',
        'error-mist':    '#FDECEC',
      },
      fontFamily: {
        display: ['Cambria', 'Georgia', '"Times New Roman"', 'serif'],
        body:    ['Calibri', 'Carlito', '"Segoe UI"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono NL"', '"JetBrains Mono"', '"Cascadia Code"', 'Consolas', 'monospace'],
      },
      borderRadius: {
        sm:      '6px',
        DEFAULT: '6px',
        md:      '10px',
        lg:      '16px',
        pill:    '999px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(46,39,81,0.08)',
        md: '0 6px 18px rgba(46,39,81,0.12)',
        lg: '0 14px 40px rgba(46,39,81,0.16)',
      },
      spacing: {
        xs:  '4px',
        sm:  '8px',
        md:  '16px',
        lg:  '24px',
        xl:  '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
    },
  },
  plugins: [],
}

export default config
