import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    colors: {
      titan: '#5F5F5F',
      black: '#000000',
      red: '#6b0000',
      white: '#ffffff',
      whiteopac: '#ffffff2f',
      green: '#105415',
      blue: '#08085e',
      red2: '#8d0018'
    }
  },
  plugins: [require('@tailwindcss/forms')]
}

export default config
