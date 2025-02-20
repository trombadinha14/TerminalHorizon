/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [ // Adicione as classes de largura aqui
    'w-16',
    'w-80',
    'w-96',
    'w-100',
    'w-200',
  ],
  theme: {
    extend: {
      width: {
        '80': '20rem',
        '96': '24rem',
        '100': '28rem',
        '200': '72rem',
      },
      colors: {
        'trading-panel': '#040a06',
        'trading-text': '#F0F0EB',
        'trading-border': '#605F5B',
        'trading-green': '#7EBF8E',
        'trading-red': '#D2886F',
        'trading-accent': '#C7FB76',
        'trading-muted': '#828179',
        'trading-hover': '#3A3935',
      },
      cursor: {
        'crosshair': 'crosshair',
      },
    },
  },
  plugins: [],
};