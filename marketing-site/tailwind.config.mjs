/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--brand-primary)',      // Gold #C8A44B
          dark:    'var(--brand-primary-dark)',
          light:   'var(--brand-primary-light)',
        },
        accent: {
          DEFAULT: 'var(--brand-accent)',
          dark:    'var(--brand-accent-dark)',
          light:   'var(--brand-accent-light)',
        },
        surface: {
          DEFAULT: 'var(--brand-surface)',      // Navy #0B1D2E
          muted:   'var(--brand-surface-muted)',
          dark:    'var(--brand-surface-dark)',
          alt:     'var(--brand-surface-alt)',
        },
        ink: {
          DEFAULT: 'var(--brand-ink)',           // Cream #F5F0E8
          muted:   'var(--brand-ink-muted)',
          faint:   'var(--brand-ink-faint)',
        },
        border: 'var(--brand-border)',
      },
      fontFamily: {
        serif:  ['"DM Serif Display"', 'Georgia', 'serif'],
        sans:   ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero':  ['clamp(2.6rem, 6vw, 4.5rem)', { lineHeight: '1.1', fontWeight: '400' }],
        'h2':    ['clamp(2rem, 4vw, 3rem)',      { lineHeight: '1.2', fontWeight: '400' }],
        'h3':    ['clamp(1.25rem, 2.5vw, 1.5rem)', { lineHeight: '1.3' }],
        'body':  ['1.0625rem', { lineHeight: '1.75' }],
        'small': ['0.875rem',  { lineHeight: '1.6'  }],
        'label': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.1em', fontWeight: '500' }],
      },
      spacing: {
        'section':   '6rem',
        'section-m': '4rem',
      },
      maxWidth: {
        'content': '1160px',
        'text':    '640px',
      },
      borderRadius: {
        'card': '0.75rem',
        'btn':  '0.375rem',
      },
    },
  },
  plugins: [],
};
