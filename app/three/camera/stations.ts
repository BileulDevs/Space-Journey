import { Vector3 } from 'three'

/**
 * SOURCE DE VÉRITÉ SPATIALE
 * Positions des corps célestes ET trajectoire caméra, au même endroit.
 * Le vaisseau vole le long de l'axe -Z.
 *
 * Cinématographie : chaque station cadre son sujet DÉCENTRÉ (règle des tiers,
 * côté opposé au panneau de texte), et les segments passent par des waypoints
 * `via` → arcs de travelling (survol de la Lune, plongée sous les anneaux,
 * contournement du trou noir) au lieu de lignes droites.
 */

export const WORLD = {
  earth: new Vector3(0, 0, 0),
  moon: new Vector3(34, 7, -12),
  sun: new Vector3(-72, 14, -34),

  mars: new Vector3(16, -3, -78),
  jupiter: new Vector3(-26, 5, -132),
  saturn: new Vector3(20, -2, -188),

  nebula: new Vector3(0, 0, -330),
  wormhole: new Vector3(0, 0, -440),

  exoplanets: [
    new Vector3(-12, 2, -520),
    new Vector3(10, -3, -552),
    new Vector3(-4, 6, -585),
    new Vector3(14, 4, -612),
  ],

  asteroids: new Vector3(0, 0, -680),
  blackhole: new Vector3(0, 0, -800),
  galaxy: new Vector3(0, -10, -1010),
}

export interface Station {
  /** position de la caméra à l'arrivée sur le chapitre */
  p: [number, number, number]
  /** point visé */
  t: [number, number, number]
  /** waypoint de caméra sur le trajet VERS cette station (arc de travelling) */
  via?: [number, number, number]
}

export const STATIONS: Station[] = [
  // 0 — Terre : Terre à droite du cadre (texte à gauche), Lune au loin
  { p: [-3, 2, 15], t: [-7, -0.5, -8] },
  // 1 — Système solaire : Jupiter en majesté à gauche, Saturne en profondeur
  //     via = survol rapproché de la Lune au décollage
  { p: [2, 3, -95], t: [-22, 4, -148], via: [22, 5, -6] },
  // 2 — Nébuleuse : on entre dans le nuage
  //     via = plongée SOUS les anneaux de Saturne
  { p: [4, 2, -286], t: [-8, 4, -346], via: [18, -8, -182] },
  // 3 — Trou de ver : alignement sur le tunnel
  { p: [0, 0, -408], t: [0, 0, -482], via: [0, 2, -372] },
  // 4 — Exoplanètes : slalom, mondes étagés dans le cadre
  { p: [14, 1, -505], t: [-8, 2, -566], via: [-2, -1, -494] },
  // 5 — Champ d'astéroïdes : traversée en diagonale
  //     via = louvoiement près de la 3e exoplanète
  { p: [-12, 4, -640], t: [10, -3, -702], via: [-14, -3, -600] },
  // 6 — Trou noir : approche par le dessus du disque, trou décentré à gauche
  { p: [0, 7, -727], t: [5, 0, -802], via: [-4, 15, -706] },
  // 7 — Nouvelle galaxie : léger surplomb contemplatif
  //     via = grand arc qui CONTOURNE le trou noir par le flanc
  { p: [0, 26, -902], t: [0, -12, -1016], via: [-30, 12, -828] },
]

/** Position/visée de départ avant le lancement (intro). */
export const INTRO_STATION: Station = { p: [-3, 2.5, 42], t: [-7, -0.5, -8] }
