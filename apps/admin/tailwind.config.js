/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        admin: {
          dark: '#0F172A',
          card: '#1E293B',
          accent: '#6366F1',
          gold: '#F59E0B',
        },
      },
    },
  },
  plugins: [],
};
