/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark theme base colors
        'dark-bg': '#1f1f2e',
        'dark-card': '#111827',
        'dark-card-hover': '#1f2937',
        'dark-border': '#2d3748',

        // Brand colors
        'primary': '#8871ff',
        'primary-dark': '#6c5ce7',
        'primary-light': '#a29bff',

        // Status colors
        'success': '#22c55e',
        'success-light': '#86efac',
        'danger': '#ef4444',
        'danger-light': '#fca5a5',
        'warning': '#f59e0b',
        'warning-light': '#fcd34d',

        // Chart colors
        'chart-green': '#10b981',
        'chart-red': '#ef4444',
      },
      backgroundColor: {
        'dark': '#1f1f2e',
        'dark-secondary': '#111827',
        'dark-tertiary': '#1f2937',
      },
      borderColor: {
        'dark': '#2d3748',
      },
      textColor: {
        'dark-primary': '#f3f4f6',
        'dark-secondary': '#d1d5db',
        'dark-tertiary': '#9ca3af',
      },
      boxShadow: {
        'dark': '0 4px 6px rgba(0, 0, 0, 0.3)',
        'dark-lg': '0 10px 25px rgba(0, 0, 0, 0.4)',
        'dark-sm': '0 1px 3px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};
