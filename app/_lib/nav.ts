import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faCar,
  faScrewdriverWrench,
  faCartShopping
} from '@fortawesome/free-solid-svg-icons'

export type NavLink = { href: string; label: string; icon: IconDefinition }

/**
 * Single source of truth for the primary navigation, shared by the header and
 * the footer so they always stay in sync.
 */
export const NAV_LINKS: NavLink[] = [
  { href: '/#vente', label: 'Vente', icon: faCar },
  { href: '/atelier', label: 'Atelier', icon: faScrewdriverWrench },
  { href: '/produits', label: 'Boutique', icon: faCartShopping }
]

// Messenger of the Facebook page tunisiancars.tn
export const CONTACT_URL = 'https://m.me/tunisiancars.tn'
