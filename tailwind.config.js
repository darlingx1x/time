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
      },
      colors: {
        primary: '#f2f3f5',
        accent: '#4f46e5',
        card: '#f7f8fa',
        text: '#2e2e2e',
        sidebar: '#e0e5ec',
        topbar: '#f2f3f5',
        border: '#e3e6ed',
        danger: '#ef4444',
        gray: {
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
        },
      },
      borderRadius: {
        neumorph: '1.5rem',
        card: '1.25rem',
        button: '1rem',
        input: '0.75rem',
      },
      transitionProperty: {
        'neumorph': 'box-shadow, background, color',
      },
    },
  },
  plugins: [],
}
