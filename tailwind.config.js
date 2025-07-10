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
        neumorphInset: 'inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff'
      },
      colors: {
        primary: '#e0e5ec',
        accent: '#a3b1c6',
        card: '#f7f8fa',
        text: '#333b4a'
      },
      borderRadius: {
        neumorph: '1.5rem'
      }
    },
  },
  plugins: [],
}
