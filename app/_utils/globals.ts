export interface MyImageData {
  src: string
  description: string
  category?: string
  tags?: string[]
}

export enum Categorie {
  TOUT = 'Tout',
  CHOCO = 'Chocolats',
  GAT = 'Gâteaux',
  MAC = 'Macarons',
  TRAD = 'Traditionnel',
  PIECE = 'Pièce montée',
  VIEN = 'Viennoiseries',
}

export const catPrice: Record<Categorie, string> = {
  Tout: 'rien',
  Chocolats: ': coffrets ou personnalisés',
  Gâteaux: 'entiers 50-90dt / pièce',
  Macarons: '80dt / kg',
  Traditionnel: '50-100dt / kg',
  'Pièce montée': 'selon vos envies',
  Viennoiseries: 'artisanale selon vos envies',
}
