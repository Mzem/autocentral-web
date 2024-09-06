import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    colors: {
      green: '#105415',
      blue: '#08085e',
      yellow: '#b3ae14',
      orange: '#b36b14',
      titan: '#5F5F5F',
      black: '#000000',
      white: '#ffffff',
      whiteopac: '#ffffff2f',
      whiteopac2: '#ffffff10',
      red: '#6b0000',
      vividred: '#B31414',
      gold: '#d4af37',
      rolexgold: '#A37E2C'
    }
  },
  plugins: [require('@tailwindcss/forms')]
}

export default config
