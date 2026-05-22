/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5a9a8f',
        cream: '#f5f1e8',
        'light-blue': '#a8d5e2',
        background: '#fafbfc',
        'text-primary': '#1a1a1a',
        'text-secondary': '#666666',
        'text-muted': '#999999',
        'border-light': '#e8e8e8',
      },
      backgroundImage: {
        'grad-primary-blue': 'linear-gradient(135deg, #5a9a8f 0%, #a8d5e2 100%)',
        'grad-primary-cream': 'linear-gradient(135deg, #5a9a8f 0%, #f5f1e8 100%)',
      }
    },
  },
  plugins: [],
}
