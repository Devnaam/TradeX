/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // TradeX Brand Colors (Strict - No Gradients)
        primary: {
          DEFAULT: '#0A2540', // Dark Blue - Headers, buttons, icons
          dark: '#061829',
          light: '#0F3A5F',
        },
        secondary: {
          DEFAULT: '#16A34A', // Green - Income, success, confirms
          dark: '#15803D',
          light: '#22C55E',
        },
        neutral: {
          50: '#F5F7FA',   // Light background
          100: '#FFFFFF',  // White cards
          200: '#E5E7EB',  // Borders
          300: '#D1D5DB',  // Input borders
          400: '#9CA3AF',  // Placeholder text
          500: '#6B7280',  // Secondary text (Pending, Rejected)
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'page-title': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'section-title': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'button': ['15px', { lineHeight: '20px', fontWeight: '500' }],
      },
      borderRadius: {
        'card': '8px',
        'button': '6px',
      },
      minHeight: {
        'touch': '44px', // Mobile touch-friendly
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
