import type { Config } from 'tailwindcss'

/**
 * Design system.
 *
 * `brand` / `ink` / `gold` are the modern scales used by the redesigned
 * surfaces. Every legacy colour key below is intentionally kept: Tailwind only
 * generates classes it actually finds in the source, so removing a key would
 * silently break the components still referencing it rather than failing loudly.
 */
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      // ---- modern palette -------------------------------------------------
      brand: {
        50: '#fff1f1',
        100: '#ffdfdf',
        200: '#ffc5c5',
        300: '#ff9d9d',
        400: '#fb6464',
        500: '#ef3535',
        600: '#dc1c1c',
        700: '#b91414',
        800: '#991616',
        900: '#7f1919',
        950: '#450808',
        DEFAULT: '#dc1c1c'
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
        950: '#0f1218',
        DEFAULT: '#0f1218'
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
        card: '0 1px 2px rgba(15,18,24,0.04), 0 4px 16px rgba(15,18,24,0.06)',
        'card-hover':
          '0 2px 4px rgba(15,18,24,0.06), 0 12px 32px rgba(15,18,24,0.12)',
        featured:
          '0 2px 8px rgba(180,20,20,0.10), 0 16px 48px rgba(15,18,24,0.16)'
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
