/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        neumorph: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
        neumorphInset: 'inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff',
        neumorphSoft: '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
        neumorphActive: 'inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff',
        softMd: '0 4px 24px 0 rgba(80, 80, 120, 0.08)',
      },
      colors: {
        primary: '#f5f7fa',
        accent: '#6366f1',
        secondary: '#6b7280',
        highlight: '#facc15',
        card: '#fff',
        text: '#000',
        gray: {
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
        },
      },
      borderRadius: {
        '2xl': '1.5rem',
        xl: '1rem',
        bento: '2rem',
        card: '1.25rem',
        button: '9999px',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        heading: '3rem', // ~text-5xl
        subheading: '1.125rem', // ~text-lg
        body: '0.95rem', // ~text-sm
      },
      spacing: {
        section: '5rem', // py-20
        cardgap: '1rem', // gap-4
      },
      maxWidth: {
        '7xl': '80rem',
        xl: '48rem',
      },
      backgroundImage: {
        'ross-gradient': 'linear-gradient(135deg, #f5f7fa 0%, #e8ebf0 100%)',
      },
      transitionProperty: {
        'neumorph': 'box-shadow, background, color',
      },
    },
  },
  plugins: [],
}
