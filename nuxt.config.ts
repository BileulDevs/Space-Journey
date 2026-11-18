import { defineNuxtConfig } from 'nuxt/config'

const SITE = {
  name: 'Space Journey',
  description:
    'Un voyage spatial cinématique piloté au scroll : Terre, système solaire, nébuleuse, trou de ver, exoplanètes, astéroïdes, trou noir et nouvelle galaxie.',
  lang: 'fr',
}

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  // Noms de composants sans préfixe de dossier (<MissionHud/> et non <HudMissionHud/>).
  // Le suffixe .client (SpaceExperience.client.vue) reste géré par Nuxt → rendu client only.
  components: [{ path: '~/components', pathPrefix: false }],

  app: {
    head: {
      htmlAttrs: { lang: SITE.lang },
      title: SITE.name,
      titleTemplate: '%s',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: SITE.description },
        { name: 'theme-color', content: '#05070d' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        // Police de télémétrie du HUD (Space Mono)
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href:
            'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap',
        },
      ],
    },
  },

  // Tolérance de build : on ne bloque pas le dev sur des types d'addons Three.
  typescript: {
    typeCheck: false,
    tsConfig: { compilerOptions: { skipLibCheck: true } },
  },


  vite: {
    // Three (et surtout ses addons) doivent passer par le même pré-bundle :
    // sinon, en dev, les addons peuvent charger une 2e instance de Three et
    // le rendu casse silencieusement (canvas vide).
    optimizeDeps: {
      include: [
        'three',
        'gsap',
        'lenis',
        'three/addons/postprocessing/EffectComposer.js',
        'three/addons/postprocessing/RenderPass.js',
        'three/addons/postprocessing/UnrealBloomPass.js',
        'three/addons/postprocessing/OutputPass.js',
        'three/addons/postprocessing/ShaderPass.js',
        'three/addons/shaders/FXAAShader.js',
      ],
    },
    build: {
      // Découpage : le moteur 3D dans son propre chunk.
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three'],
            gsap: ['gsap'],
          },
        },
      },
    },
  },

  nitro: {
    // Compression des réponses HTML/JS.
    compressPublicAssets: true,
  },
})
