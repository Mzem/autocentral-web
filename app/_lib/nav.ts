import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faCar,
  faScrewdriverWrench,
  faCartShopping,
  faBook,
  faBullhorn,
  faStore
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

/** Extra links shown in the header only when a merchant is logged in. */
export const ADMIN_NAV_LINKS: NavLink[] = [
  { href: '/annonces', label: 'Annonces', icon: faBullhorn },
  { href: '/vendeurs', label: 'Vendeurs', icon: faStore }
]

// Messenger of the Facebook page tunisiancars.tn
export const CONTACT_URL = 'https://m.me/tunisiancars.tn'
