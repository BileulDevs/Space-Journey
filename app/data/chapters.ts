/**
 * Chapitres du voyage — métadonnées de navigation (HUD).
 * `label` = ce que l'on traverse, `body` = précision de position.
 * `wide` = plage de scroll allongée (transitions immersives).
 */
export interface Chapter {
  index: number
  id: string
  label: string
  body: string
  wide?: boolean
}

export const chapters: Chapter[] = [
  { index: 0, id: 'earth', label: 'Terre', body: 'ORBITE BASSE · LUNE · SOLEIL' },
  { index: 1, id: 'system', label: 'Système solaire', body: 'MARS · JUPITER · SATURNE' },
  { index: 2, id: 'nebula', label: 'Nébuleuse', body: 'NUAGE INTERSTELLAIRE' },
  { index: 3, id: 'wormhole', label: 'Trou de ver', body: 'PLIAGE DE L’ESPACE-TEMPS', wide: true },
  { index: 4, id: 'exoplanets', label: 'Exoplanètes', body: 'SYSTÈME EXTRASOLAIRE' },
  { index: 5, id: 'asteroids', label: "Champ d'astéroïdes", body: 'ZONE DE DÉBRIS' },
  { index: 6, id: 'blackhole', label: 'Trou noir', body: 'HORIZON DES ÉVÉNEMENTS' },
  { index: 7, id: 'galaxy', label: 'Nouvelle galaxie', body: 'ESPACE INTERGALACTIQUE', wide: true },
]
