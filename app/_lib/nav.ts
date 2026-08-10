import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faCar,
  faScrewdriverWrench,
  faCartShopping,
  faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons'

export type NavLink = { href: string; label: string; icon: IconDefinition }

/**
 * Single source of truth for the primary navigation, shared by the header and
 * the footer so they always stay in sync.
 */
export const NAV_LINKS: NavLink[] = [
  { href: '/#vente', label: 'Vente', icon: faCar },
  { href: '/atelier', label: 'Atelier', icon: faScrewdriverWrench },
  { href: '/produits', label: 'Boutique', icon: faCartShopping },
  { href: '/annonces', label: 'Moteur de recherche', icon: faMagnifyingGlass }
]

/** Extra links shown in the header only when a merchant is logged in. */
export const ADMIN_NAV_LINKS: NavLink[] = []

// Messenger of the Facebook page tunisiancars.tn
export const CONTACT_URL = 'https://m.me/tunisiancars.tn'
