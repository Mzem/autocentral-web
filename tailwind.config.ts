import type { Config } from 'tailwindcss'

/**
 * Design system — dark, sober (Tunisian Cars brand direction).
 *
 * Near-black base, white text, a single restrained steel-blue accent (`brand`,
 * taken from the logo but desaturated to stay sober), thin white/10 borders.
 * `surface` holds the card backgrounds that sit on the near-black body.
 * Legacy colour keys are kept so any component still referencing them renders.
 */
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      // ---- accent: sober steel blue (was red) -----------------------------
      brand: {
        50: '#eef6fb',
        100: '#d6e9f4',
        200: '#aed3e8',
        300: '#7cb6d6',
        400: '#4f97bf',
        500: '#3585ac',
        600: '#2b6d8e',
        700: '#265a76',
        800: '#254c63',
        900: '#223f53',
        950: '#132735',
        DEFAULT: '#3585ac'
      },
      // ---- card/panel backgrounds on the near-black body ------------------
      surface: {
        DEFAULT: '#16181e',
        raised: '#1e212a',
        sunken: '#0b0c10',
        border: '#262a33'
      },
      ink: {
        50: '#f6f7f9',
        100: '#eceef2',
        200: '#d5dae3',
        300: '#b0bacb',
        400: '#8595ae',
        500: '#667794',
        600: '#515f7a',
        700: '#424d63',
        800: '#3a4253',
        900: '#343a47',
        950: '#0d0f14',
        DEFAULT: '#0d0f14'
      },
      gold: {
        50: '#fbf8ef',
        100: '#f5edd3',
        200: '#ead9a8',
        300: '#dcbf74',
        400: '#d4af37',
        500: '#c69a2c',
        600: '#a37e2c',
        700: '#856224',
        800: '#6f5024',
        900: '#5f4522',
        DEFAULT: '#d4af37'
      },
      success: '#16a34a',
      warning: '#f59e0b',
      danger: '#dc2626',

      // ---- legacy keys (kept so existing components keep rendering) --------
      green: '#105415',
      greenopac: '#1054154f',
      blue: '#08085e',
      yellow: '#b3ae14',
      orange: '#b36b14',
      black: '#000000',
      blacklight: '#2d2d2d',
      blacknotopac: '#151515',
      blackopac: '#151515ee',
      blackopac2: '#15151560',
      blackopac3: '#131313',
      pureblack: '#000000',
      white: '#ffffff',
      whiteBG: '#f9f9fa',
      whiteBGDarker: '#e7e7e7e7',
      whiteopac: '#ffffff2f',
      whiteopac2: '#ffffff10',
      whiteopac3: '#ffffff05',
      titan: '#cecdcd',
      titanopac: '#cecdcdaa',
      cream: '#ede7d1',
      red: '#371211',
      vividred: '#B31414ee',
      rolexgold: '#a37e2c',
      rolexgoldopac: '#a37e2caa',
      whatsapp: '#25d366',
      whiteopacred: '#B3141425'
    },
    screens: {
      sm: '390px', // small mobile
      md: '768px', // tablets
      lg: '1024px', // desktop
      xl: '1289px' // large screens
    },
    extend: {
      screens: {
        xs: { max: '352px' },
        mdm: { max: '768px' },
        xxl: { min: '1600px' }
      },
      fontFamily: {
        sans: ['var(--font-open-sans)', 'sans-serif']
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem'
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.35)',
        'card-hover': '0 2px 6px rgba(0,0,0,0.5), 0 18px 48px rgba(0,0,0,0.55)',
        featured: '0 0 0 1px rgba(53,133,172,0.25), 0 24px 60px rgba(0,0,0,0.6)'
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.4s ease-out both'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}

export default config
