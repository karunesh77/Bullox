/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Base Backgrounds ─────────────────────────────
        'bg-base':      '#0B0F19',   // main page background
        'bg-card':      '#111827',   // card surfaces
        'bg-card-hover':'#1A2233',   // card hover lift
        'bg-elevated':  '#1F2937',   // inputs, inner panels

        // ── Borders / Dividers ────────────────────────────
        'border-base':  '#1F2937',

        // ── Brand Blue ────────────────────────────────────
        'blue':         '#3B82F6',
        'blue-hover':   '#2563EB',

        // ── Text Hierarchy ────────────────────────────────
        'text-primary':   '#E5E7EB',
        'text-secondary': '#9CA3AF',
        'text-muted':     '#6B7280',

        // ── Profit / Loss ────────────────────────────────
        'profit':         '#22C55E',
        'loss':           '#EF4444',

        // ── Accent ───────────────────────────────────────
        'accent-yellow':  '#F59E0B',

        // ── Legacy keys (used in older components) ────────
        'dark-bg':        '#0B0F19',
        'dark-card':      '#111827',
        'dark-card-hover':'#1A2233',
        'dark-border':    '#1F2937',
        'primary':        '#3B82F6',
        'primary-dark':   '#2563EB',
        'success':        '#22C55E',
        'danger':         '#EF4444',
        'warning':        '#F59E0B',
      },
      backgroundColor: {
        'dark':           '#0B0F19',
        'dark-secondary': '#111827',
        'dark-tertiary':  '#1F2937',
      },
      borderColor: {
        'dark': '#1F2937',
      },
      textColor: {
        'dark-primary':   '#E5E7EB',
        'dark-secondary': '#9CA3AF',
        'dark-tertiary':  '#6B7280',
      },
      boxShadow: {
        'card':    '0 4px 24px rgba(0,0,0,0.4)',
        'card-lg': '0 8px 40px rgba(0,0,0,0.55)',
        'blue':    '0 4px 20px rgba(59,130,246,0.25)',
        'green':   '0 4px 20px rgba(34,197,94,0.20)',
      },
    },
  },
  plugins: [],
};
