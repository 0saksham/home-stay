/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // House of Marigold — 5-color system only
        hom: {
          black:  '#0A0A0A',   // near-black
          white:  '#F8F5F0',   // warm white
          gold:   '#C9A84C',   // muted gold
          forest: '#1A2E1A',   // dark green
          stone:  '#8B8680',   // warm gray
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body:    ['"Jost"', 'sans-serif'],
        // Keep legacy aliases so old Tailwind classes don't break things
        sans:  ['"Jost"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
      },
      fontSize: {
        'display-1': ['clamp(48px,6vw,88px)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-2': ['52px',  { lineHeight: '1.1',  letterSpacing: '-0.01em' }],
        'display-3': ['32px',  { lineHeight: '1.2' }],
        'body-lg':   ['14px',  { lineHeight: '1.9',  letterSpacing: '0.04em' }],
        'label':     ['11px',  { lineHeight: '1',    letterSpacing: '0.15em' }],
        'eyebrow':   ['10px',  { lineHeight: '1',    letterSpacing: '0.2em'  }],
      },
      animation: {
        'scroll-line': 'scrollLine 1.8s ease-in-out infinite',
        'nav-fade':    'navFade 0.4s ease',
      },
      keyframes: {
        scrollLine: {
          '0%':   { transform: 'scaleY(0)', transformOrigin: 'top', opacity: '1' },
          '50%':  { transform: 'scaleY(1)', transformOrigin: 'top', opacity: '1' },
          '100%': { transform: 'scaleY(1)', transformOrigin: 'bottom', opacity: '0' },
        },
        navFade: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
