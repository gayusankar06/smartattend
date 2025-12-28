/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
        },
        success: {
          500: '#22c55e',
        },
        warning: {
          500: '#eab308',
        },
        danger: {
          500: '#ef4444',
        }
      }
    },
  },
  plugins: [],
}