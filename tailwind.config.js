/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Beyaz tema: ana arka plan ve yüzeyler
        surface: {
          white: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Logodan türetilmiş: mavi ve yeşil vurgu
        accent: {
          blue: '#2563eb',
          'blue-light': '#3b82f6',
          'blue-soft': '#eff6ff',
          green: '#22c55e',
          'green-light': '#10b981',
          'green-soft': '#ecfdf5',
        },
        navy: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
          dark: '#020617',
        },
        // Başlıklar için koyu lacivert / koyu gri
        heading: {
          DEFAULT: '#0f172a',
          muted: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-soft':
          'radial-gradient(ellipse 100% 80% at 30% 0%, rgba(37, 99, 235, 0.08), transparent 50%), radial-gradient(ellipse 80% 60% at 70% 100%, rgba(5, 150, 105, 0.06), transparent 50%)',
        'gradient-brand': 'linear-gradient(135deg, #2563eb 0%, #059669 100%)',
        'gradient-cta': 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)',
      },
      boxShadow: {
        soft: '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 4px 24px -4px rgba(0, 0, 0, 0.08)',
        'header-scroll': '0 1px 3px 0 rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-up': 'fadeUp 0.4s ease-out',
        'fade-up-hero': 'fadeUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out 0.15s forwards',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.96)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
      },
      transitionDuration: {
        250: '250ms',
      },
    },
  },
  plugins: [],
}
