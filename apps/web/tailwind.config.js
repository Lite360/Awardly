/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette — maps to CSS variables for runtime configurability
        primary: {
          DEFAULT: 'var(--color-primary, #007A4D)',
          dark: 'var(--color-primary-dark, #054C31)',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#007A4D',
          600: '#006B3F',
          700: '#055835',
          800: '#064e2e',
          900: '#053c24',
        },
        accent: {
          DEFAULT: 'var(--color-accent, #EBF700)',
          light: '#f2fa4d',
          dark: '#c4ce00',
        },
        mint: {
          50: '#F4FAF5',
          100: '#EAF6EC',
          200: '#D5EDDB',
          300: '#B0DFBC',
        },
        forest: {
          800: '#0A2518',
          900: '#051A10',
          950: '#03110A',
        },
        ivory: {
          DEFAULT: 'var(--color-background, #F4FAF5)',
          50: '#F4FAF5',
          100: '#EAF6EC',
        },
        charcoal: {
          DEFAULT: 'var(--color-text, #0B2B1B)',
          50: '#f9f9f9',
          700: '#374151',
          800: '#112219',
          900: '#0B2B1B',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: 'var(--radius-card, 16px)',
        button: 'var(--radius-button, 10px)',
      },
      maxWidth: {
        container: 'var(--container-width, 1200px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(212, 175, 55, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero':
          'linear-gradient(135deg, #3B0764 0%, #5B21B6 50%, #7c3aed 100%)',
        'gradient-gold':
          'linear-gradient(135deg, #b8960e 0%, #D4AF37 50%, #e8cc6a 100%)',
        'shimmer-gradient':
          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 40px rgba(91,33,182,0.15)',
        glow: '0 0 40px rgba(91,33,182,0.3)',
        'glow-gold': '0 0 40px rgba(212,175,55,0.3)',
      },
    },
  },
  plugins: [],
};
