export const identity = {
  name: 'Bilel Sahraoui',
  role: 'Développeur Full Stack',
  stack: 'Node.js · TypeScript',
  location: 'Vaujours, Île-de-France',
  email: 'bsahraoui.mail@gmail.com',
  phone: '07 68 63 63 15',
  github: 'https://github.com/BileulDevs',
  portfolio: 'https://bilelsahraoui.netlify.app/',
  cv: '/cv-bilel-sahraoui.pdf',
  slogan: "Je construis des systèmes qui tiennent à l'échelle — du backend à l'orbite.",
}

export interface Planet {
  id: string
  name: string
  domain: string
  items: string[]
}

/** Chapitre 2 — Système solaire : chaque corps = un domaine de compétence. */
export const competences: Planet[] = [
  {
    id: 'mars',
    name: 'Mars',
    domain: 'Langages',
    items: ['JavaScript', 'TypeScript', 'C# (.NET)', 'Java', 'PHP'],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    domain: 'Backend & Architecture',
    items: [
      'Node.js (Express)', 'APIs REST', 'OpenAPI / Swagger', 'Clean Architecture',
      'Microservices', 'JWT', 'Zod', 'Prisma', 'Stripe',
    ],
  },
  {
    id: 'saturn',
    name: 'Saturne',
    domain: 'DevOps · Cloud · Données',
    // les anneaux = les couches de données
    items: [
      'Azure', 'Azure DevOps', 'Azure Vault', 'Railway', 'CI/CD', 'Docker', 'Git',
      'Monitoring (Winston)', 'PostgreSQL', 'MySQL', 'MongoDB', 'Sequelize',
      'Mongoose', 'Supabase', 'Cloudflare R2',
    ],
  },
  {
    id: 'belt',
    name: "Ceinture d'astéroïdes",
    domain: 'Frontend & Qualité',
    items: [
      'Vue.js / Nuxt.js', 'React / Next.js', 'HTML5 / CSS3', 'TailwindCSS',
      'Agilité (Scrum)', 'Tests unitaires', 'Code Review', 'RGPD',
    ],
  },
  {
    id: 'uranus',
    name: 'Uranus',
    domain: 'Notions',
    items: ['Laravel', 'Symfony', 'React Native', 'Angular'],
  },
  {
    id: 'neptune',
    name: 'Neptune',
    domain: 'Outils & IA',
    items: ['Claude Code', 'GitHub Copilot'],
  },
]

/** Chapitre 3 — Nébuleuse : le parcours, là où la carrière s'est condensée. */
export const parcours = [
  {
    title: 'Fondateur / Développeur Full Stack',
    org: 'Noxtys',
    period: 'Janv. 2026 — Oct. 2026',
    points: [
      "Conception et développement solo d'un SaaS (TypeScript), de l'architecture à la mise en production (Railway) : Next.js 14 App Router, Express 5, PostgreSQL/Prisma.",
      'Architecture backend modulaire stricte (schema → service → controller → routes → openapi) avec Zod comme source unique de validation et de typage.',
      "Intégration paiement complète (Stripe : webhooks, proration, Subscription Schedules) avec gestion de quotas par plan et contrôles d'accès (IDOR).",
      'Pipeline de modération de contenu conforme DSA (signalement, revue, décisions).',
      'Stockage objet (Cloudflare R2), authentification, tests (Vitest), documentation API générée (OpenAPI/Swagger).',
      'Application en production, maintenue en continu (correctifs, évolutions).',
    ],
  },
  {
    title: 'Développeur Full Stack',
    org: 'Athlon Car Lease',
    period: 'Sept. 2022 — Oct. 2025 · 3 ans',
    points: [
      'Co-conception, développement et maintenance de 10+ applications métier critiques (Node.js, C# .NET, Vue.js) utilisées au quotidien par plus de 1 500 collaborateurs internes.',
      "Déploiement d'un système de monitoring unifié sur 50+ applications Cloud (disponibilité, traçage des erreurs HTTP) : temps moyen de détection (MTTD) des incidents divisé par 2.",
      "Conception et déploiement d'une application web interne de conformité RGPD : chiffrement, déchiffrement et purge automatisée des données sur une base de 4 To.",
      'Optimisation des traitements batch (tâches planifiées nocturnes) : −80 % de charge serveur en heures ouvrées et temps de réponse applicatifs améliorés de 30 %.',
      "Migration de 50+ applications métier vers Azure : −25 % de coûts d'infrastructure, disponibilité portée à 99,9 %.",
    ],
  },
  {
    title: 'Rédacteur technique',
    org: 'Athlon Car Lease',
    period: 'Juin 2022 — Sept. 2022 · 4 mois',
    points: [
      "Restructuration et rédaction de 200+ fiches de documentation technique et schémas d'architecture, sécurisant et fluidifiant l'intégration des équipes d'ingénierie vers les nouvelles infrastructures Cloud Azure.",
    ],
  },
]

/** Chapitre 5 — Exoplanètes : chaque planète = un projet. */
export interface Project {
  id: string
  name: string
  tagline: string
  stack: string[]
  description: string
  link?: { label: string; url: string }
}

export const projets: Project[] = [
  {
    id: 'noxtys',
    name: 'Noxtys',
    tagline: 'SaaS conçu et déployé en solo',
    stack: ['Next.js 14', 'Express 5', 'PostgreSQL/Prisma', 'Zod', 'Stripe'],
    description:
      "Compagnon d'observation pour astronomes amateurs : planification, journal de session et galerie d'astrophotographie. SaaS TypeScript porté seul de l'architecture à la production — abonnements multi-tiers (Stripe : webhooks, proration, Subscription Schedules, quotas par plan), contrôles d'accès (IDOR), modération de contenu conforme DSA et API documentée (OpenAPI). En production, maintenu en continu.",
    link: { label: 'Noxtys', url: 'https://noxtys.com' },
  },
  {
    id: 'minecraft',
    name: 'Mods Minecraft (Java)',
    tagline: '+1 300 000 téléchargements',
    stack: ['Java', 'Architecture modulaire', 'Client/Serveur', 'Multijoueur'],
    description:
      "Conception et publication de mods Java atteignant plus de 1 300 000 téléchargements sur CurseForge et Modrinth. Addons client/serveur gérant la compatibilité entre environnements et l'optimisation des performances en multijoueur, avec une architecture modulaire et une maintenance sur plusieurs versions majeures du jeu.",
    link: { label: 'CurseForge', url: 'https://www.curseforge.com/members/darcosse/projects' },
  },
  {
    id: 'rgpd',
    name: 'Plateforme de conformité RGPD',
    tagline: 'Sécurité des données à 4 To',
    stack: ['Node.js', 'Chiffrement', 'Jobs planifiés'],
    description:
      "Application web interne dédiée au chiffrement, déchiffrement et à la purge automatisée des données personnelles sur une base de 4 To, en conformité RGPD.",
  },
  {
    id: 'monitoring',
    name: 'Monitoring des applications Cloud',
    tagline: '50+ applications surveillées',
    stack: ['Node.js', 'Winston', 'Azure', 'Monitoring'],
    description:
      "Plateforme de monitoring couvrant plus de 50 applications Cloud : suivi de disponibilité et traçage des erreurs HTTP. Temps moyen de détection des incidents (MTTD) divisé par deux.",
  },
  {
    id: 'azure-migration',
    name: 'Migration Cloud Azure',
    tagline: '−25 % de coûts · 99,9 % de dispo',
    stack: ['Azure', 'Azure DevOps', 'CI/CD', 'Docker'],
    description:
      "Migration de 50+ applications métier vers Azure, réduisant les coûts d'infrastructure de 25 % et portant la disponibilité à 99,9 %.",
  },
]

/** Chapitre 6 — Champ d'astéroïdes : réalisations chiffrées & diplômes. */
export const realisations = {
  metrics: [
    { n: '1,3M+', l: 'téléchargements cumulés' },
    { n: '×2', l: 'détection des incidents (MTTD)' },
    { n: '−80%', l: 'charge serveur en heures ouvrées' },
    { n: '99,9%', l: 'disponibilité applicative' },
    { n: '1 500+', l: 'utilisateurs internes servis' },
    { n: '−25%', l: "coûts d'infrastructure Cloud" },
    { n: '0 → prod', l: 'SaaS porté seul jusqu’au déploiement' },
  ],
  diplomas: [
    { title: 'Master 2 — Expert en Développement Web (Bac+5)', org: 'Paris Ynov Campus', period: '2025' },
    { title: 'BTS SIO — Option SLAM', org: 'Lycée Polyvalent de Cachan', period: '2022' },
  ],
}

/** Chapitre 7 — Trou noir : vision & philosophie. */
export const vision = {
  title: 'Construire pour durer',
  paragraphs: [
    "Le code que j'écris doit survivre à l'enthousiasme du premier jour. Architecture propre, séparation des responsabilités, observabilité : la fiabilité n'est pas une option, c'est la fondation.",
    "Mes projets personnels tel que mes mods à + d'1,3 million de téléchargements m'ont appris à concevoir pour l'échelle dès la première ligne. Mon expérience en entreprise m'a appris à le faire sous contrainte, en production, pour des milliers d'utilisateurs.",
    "Concevoir seul un SaaS complet — architecture, paiement, conformité, déploiement — m'a appris ce qu'on ne délègue pas : les décisions structurantes se prennent tôt, et chacune se paie plus tard.",
    "Du RGPD au monitoring de 50+ applications, j'ai appris que la confidentialité se conçoit dès le départ, que les performances se mesurent, et que seul le comportement en production dit si une décision technique tient dans la durée.",
  ],
}

/** Chapitre 8 — Nouvelle galaxie : contact. */
export const contact = {
  headline: 'Le voyage continue ailleurs',
  subline: "À la recherche d'un CDI en développement web. Construisons quelque chose qui dure.",
}

/**
 * Chapitres — métadonnées de navigation (télémétrie HUD).
 * `body` désigne le corps céleste affiché par le HUD.
 */
export interface Chapter {
  index: number
  id: string
  body: string // libellé HUD
  label: string // titre court
}

export const chapters: Chapter[] = [
  { index: 0, id: 'earth', body: 'TERRE — ORBITE BASSE', label: 'Origine' },
  { index: 1, id: 'system', body: 'SYSTÈME SOLAIRE', label: 'Compétences' },
  { index: 2, id: 'nebula', body: 'NÉBULEUSE', label: 'Parcours' },
  { index: 3, id: 'wormhole', body: 'TROU DE VER', label: 'Transition' },
  { index: 4, id: 'exoplanets', body: 'EXOPLANÈTES', label: 'Projets' },
  { index: 5, id: 'asteroids', body: "CHAMP D'ASTÉROÏDES", label: 'Réalisations' },
  { index: 6, id: 'blackhole', body: 'TROU NOIR', label: 'Vision' },
  { index: 7, id: 'galaxy', body: 'NOUVELLE GALAXIE', label: 'Contact' },
]

/** Schéma JSON-LD (structured data) pour le SEO. */
export function personSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: identity.name,
    jobTitle: identity.role,
    email: 'mailto:' + identity.email,
    url: siteUrl,
    address: { '@type': 'PostalAddress', addressLocality: 'Île-de-France', addressCountry: 'FR' },
    knowsAbout: [
      'Node.js', 'TypeScript', '.NET', 'Java', 'PHP', 'Vue.js', 'Nuxt', 'React', 'Next.js',
      'Azure', 'Docker', 'Clean Architecture', 'Microservices', 'OpenAPI',
      'PostgreSQL', 'Prisma', 'Zod', 'Stripe', 'Cloudflare R2', 'RGPD',
    ],
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Paris Ynov Campus' },
      { '@type': 'EducationalOrganization', name: 'Lycée Polyvalent de Cachan' },
    ],
  }
}