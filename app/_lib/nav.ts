import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faCar,
  faScrewdriverWrench,
  faCartShopping,
  faMagnifyingGlass,
  faCalculator,
  faGavel
} from '@fortawesome/free-solid-svg-icons'
import { TC_MESSENGER_URL, TC_WHATSAPP_URL } from './site'

export type NavLink = {
  href: string
  label: string
  /** Shorter label for narrow screens (falls back to `label`). */
  short?: string
  icon: IconDefinition
}

/**
 * Tunisian Cars primary navigation - single source of truth shared by its
 * header and footer so they always stay in sync.
 */
export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Atelier', icon: faScrewdriverWrench },
  { href: '/vente', label: 'Vente', icon: faCar },
  { href: '/produits', label: 'Boutique', icon: faCartShopping }
]

/** Extra links shown in the header only when a merchant is logged in. */
export const ADMIN_NAV_LINKS: NavLink[] = []

/**
 * Autocentral (autocentral.tn) navigation: the search engine, the price
 * estimate and the auctions.
 */
export const AC_NAV_LINKS: NavLink[] = [
  {
    href: '/annonces',
    label: 'Moteur de recherche',
    short: 'Recherche',
    icon: faMagnifyingGlass
  },
  {
    href: '/estimation',
    label: 'Estimer mon véhicule',
    short: 'Estimer',
    icon: faCalculator
  },
  { href: '/encheres', label: 'Enchères', icon: faGavel }
]

// Tunisian Cars contact channels (header + footer).
export const CONTACT_URL = TC_MESSENGER_URL
export const WHATSAPP_URL = TC_WHATSAPP_URL
