/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      animation: {
        'ripple-1': 'ripple 3s linear infinite 0.3s',
        'ripple-2': 'ripple 3s linear infinite 0.6s',
        'ripple-3': 'ripple 3s linear infinite 0.9s',
        'ripple-4': 'ripple 3s linear infinite 1.2s',
        'ripple-5': 'ripple 3s linear infinite 1.5s',
        'ripple-6': 'ripple 3s linear infinite 1.8s',
        'ripple-7': 'ripple 3s linear infinite 2.1s',
        'ripple-8': 'ripple 3s linear infinite 2.4s',
        'ripple-9': 'ripple 3s linear infinite 2.7s',
        'ripple-10': 'ripple 3s linear infinite 3s',
      },
      keyframes: {
        ripple: {
          '0%': {
            transform: 'scale(0.5)',
            opacity: '1',
            boxShadow: '0px 0px 20px rgba(255, 255, 255, 0.8)',
          },
          '50%': {
            transform: 'scale(1.5)',
            opacity: '0.8',
            boxShadow: '0px 0px 40px rgba(255, 255, 255, 0.6)',
          },
          '100%': {
            transform: 'scale(2.5)',
            opacity: '0',
            boxShadow: '0px 0px 60px rgba(255, 255, 255, 0)',
          },
        },
      },
    },
  },
  plugins: [],
}
