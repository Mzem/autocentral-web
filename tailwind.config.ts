import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    colors: {
      titan: '#5F5F5F',
      black: '#000000',
      red: '#6b0000',
      white: '#ffffff'
    }
  },
  plugins: [require('@tailwindcss/forms')]
}

export default config
