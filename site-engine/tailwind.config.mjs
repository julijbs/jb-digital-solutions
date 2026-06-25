/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--brand-primary)',
          dark:    'var(--brand-primary-dark)',
          light:   'var(--brand-primary-light)',
        },
        accent: {
          DEFAULT: 'var(--brand-accent)',
          dark:    'var(--brand-accent-dark)',
          light:   'var(--brand-accent-light)',
        },
        surface: {
          DEFAULT: 'var(--brand-surface)',
          muted:   'var(--brand-surface-muted)',
          dark:    'var(--brand-surface-dark)',
        },
        ink: {
          DEFAULT: 'var(--brand-ink)',
          muted:   'var(--brand-ink-muted)',
          faint:   'var(--brand-ink-faint)',
        },
      },
      fontFamily: {
        serif:  ['Fraunces', 'Georgia', 'serif'],
        sans:   ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero':   ['clamp(2.6rem, 6vw, 4.5rem)', { lineHeight: '1.1', fontWeight: '700' }],
        'h2':     ['clamp(2rem, 4vw, 3rem)',      { lineHeight: '1.2', fontWeight: '600' }],
        'h3':     ['clamp(1.25rem, 2.5vw, 1.5rem)', { lineHeight: '1.3' }],
        'body':   ['1.0625rem', { lineHeight: '1.75' }],
        'small':  ['0.875rem',  { lineHeight: '1.6'  }],
        'label':  ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.1em', fontWeight: '500' }],
      },
      spacing: {
        'section':  '7rem',     // vertical section padding desktop
        'section-m': '4.5rem',  // vertical section padding mobile
      },
      maxWidth: {
        'content': '1160px',
        'text':    '640px',
      },
      borderRadius: {
        'photo': '0.75rem',
        'btn':   '0.375rem',
      },
    },
  },
  plugins: [],
};
