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
          primary: '#6D28D9',    // Primary Purple
          secondary: '#7C3AED',  // Secondary Purple
          light: '#F5F3FF',      // Light Purple background/hover
          dark: '#2E1065',       // Dark Purple for Sidebar / Headers
          accent: '#8B5CF6',     // Gradient Purple endpoint
          soft: '#EDE9FE',       // Soft border / tab highlight
          hover: '#5B21B6',      // Darker hover
        },
        surface: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'purple-glow': '0 4px 20px -2px rgba(109, 40, 217, 0.35)',
        'purple-lg': '0 10px 25px -5px rgba(109, 40, 217, 0.25)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 12px 28px -6px rgba(109, 40, 217, 0.15)',
      },
      minHeight: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      }
    },
  },
  plugins: [],
}
