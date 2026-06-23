/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Calm Trust — palette for psicólogo/saúde mental
        primary: {
          DEFAULT: '#3E5C76',   // slate blue
          dark:    '#2F4A60',   // for small text / hover
          light:   '#5A7A9A',   // for hover states
        },
        accent: {
          DEFAULT: '#C08552',   // amber terracotta
          dark:    '#8A5A33',   // contrast-safe for small text
          light:   '#D4A070',   // hover
        },
        surface: {
          DEFAULT: '#F4F2ED',   // warm off-white (bg)
          muted:   '#EAE7E0',   // slightly darker warm (cards, section tint)
          dark:    '#DDD9D0',   // dividers
        },
        ink: {
          DEFAULT: '#1E2733',   // main text
          muted:   '#5A6475',   // secondary text
          faint:   '#8A919E',   // captions, labels
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
