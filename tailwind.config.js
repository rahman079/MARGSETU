/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          900: '#064e3b',
        },
        status: {
          clear: '#10B981',
          warning: '#F59E0B',
          blocked: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.12)',
        'glow-emerald': '0 0 20px -2px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 20px -2px rgba(245, 158, 11, 0.35)',
        'glow-rose': '0 0 20px -2px rgba(239, 68, 68, 0.35)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
