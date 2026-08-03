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

      // ---- accent: Tunisian Cars blue -------------------------------------
      brand: {
        50: '#e6f2fd',
        100: '#cce4fb',
        200: '#99c9f7',
        300: '#66aef3',
        400: '#3393ef',
        500: '#0081E3',
        600: '#006ec2',
        700: '#00559a',
        800: '#004073',
        900: '#002c4f',
        950: '#001a30',
        DEFAULT: '#0081E3'
      },
      // ---- brand grey (logo / dividers / muted labels) --------------------
      mist: {
        DEFAULT: '#C2C2C4',
        light: '#d8d8da',
        dark: '#9a9a9d'
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
      sm: '400px', // small mobile
      md: '850px', // tablets
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
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: [
          'var(--font-display)',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ]
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem'
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.35)',
        'card-hover': '0 2px 6px rgba(0,0,0,0.5), 0 18px 48px rgba(0,0,0,0.55)',
        featured: '0 0 0 1px rgba(0,129,227,0.25), 0 24px 60px rgba(0,0,0,0.6)',
        'card-light':
          '0 1px 2px rgba(16,24,40,0.06), 0 12px 32px rgba(16,24,40,0.10)',
        'card-light-hover':
          '0 2px 6px rgba(16,24,40,0.10), 0 22px 48px rgba(16,24,40,0.16)'
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        kenburns: {
          '0%': { transform: 'scale(1.05) translate(0, 0)' },
          '100%': { transform: 'scale(1.18) translate(-1.5%, -1.5%)' }
        },
        // Slowly drifting vignette so the darkening feels like a moving halo.
        halo: {
          '0%': { transform: 'translate3d(-6%, -4%, 0) scale(1.25)' },
          '50%': { transform: 'translate3d(6%, 5%, 0) scale(1.4)' },
          '100%': { transform: 'translate3d(-6%, -4%, 0) scale(1.25)' }
        },
        // A "VENDU" stamp that slams in, shakes, then fades away.
        'sold-stamp': {
          '0%': { opacity: '0', transform: 'scale(1.5) rotate(-5deg)' },
          '12%': { opacity: '1', transform: 'scale(1) rotate(-5deg)' },
          '22%': { transform: 'scale(1) rotate(-5deg) translateX(-7px)' },
          '34%': { transform: 'scale(1) rotate(-5deg) translateX(7px)' },
          '46%': { transform: 'scale(1) rotate(-5deg) translateX(-5px)' },
          '58%': { transform: 'scale(1) rotate(-5deg) translateX(5px)' },
          '70%': { transform: 'scale(1) rotate(-5deg) translateX(-2px)' },
          '80%': {
            opacity: '1',
            transform: 'scale(1) rotate(-5deg) translateX(0)'
          },
          '100%': { opacity: '0', transform: 'scale(1.15) rotate(-5deg)' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.4s ease-out both',
        'fade-in': 'fade-in 0.8s ease-out both',
        kenburns: 'kenburns 32s ease-out both',
        halo: 'halo 16s ease-in-out infinite',
        'sold-stamp': 'sold-stamp 1.3s ease-out forwards'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}

export default config
