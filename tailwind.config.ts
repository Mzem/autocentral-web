import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    colors: {
      green: '#105415',
      blue: '#08085e',
      yellow: '#b3ae14',
      orange: '#b36b14',
      black: '#151515',
      blacklight: '#2d2d2d',
      blackopac: '#151515f5',
      blackopac2: '#15151560',
      pureblack: '#000000',
      white: '#ffffff',
      whiteBG: '#f5f5f7',
      whiteBGDarker: '#e7e7e7e7',
      whiteopac: '#ffffff2f',
      whiteopac2: '#ffffff10',
      whiteopac3: '#ffffff05',
      titan: '#cecdcd',
      cream: '#ede7d1',
      red: '#371211',
      vividred: '#B31414',
      gold: '#d4af37'
    }
  },
  plugins: [require('@tailwindcss/forms')]
}

export default config
