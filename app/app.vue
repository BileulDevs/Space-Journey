<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useScrollJourney } from '~/composables/useScrollJourney'
import { useSpaceAudio } from '~/composables/useSpaceAudio'
import { personSchema } from '~/data/profile'
import SpaceExperience from '~/components/SpaceExperience.vue'

const showIntro = ref(true)
const config = useRuntimeConfig()
const journey = useScrollJourney()
const audio = useSpaceAudio()
const audioMuted = audio.muted

// Données structurées (SEO) — rendu côté serveur dans le <head>.
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(personSchema(config.public.siteUrl as string)),
    },
  ],
})

function onEngage() {
  // le clic « Entrer » est le geste utilisateur requis pour démarrer l'audio
  audio.start()
  journey.start()
  setTimeout(() => (showIntro.value = false), 1300)
}

function onReturn() {
  journey.scrollToTop()
}

function onNav(id: string) {
  journey.scrollToSection(id)
}

function onToggleAudio() {
  audio.toggle()
}

onMounted(() => {
  journey.setup()
})

onBeforeUnmount(() => {
  journey.destroy()
  audio.destroy()
})
</script>

<template>
  <div>
    <!-- couche 3D (client only) -->
    <ClientOnly>
      <SpaceExperience />
    </ClientOnly>

    <!-- HUD de mission persistant : chapitres cliquables + son -->
    <MissionHud :muted="audioMuted" @nav="onNav" @toggle-audio="onToggleAudio" />

    <!-- contenu / chapitres (SSR, indexable) -->
    <ChapterLayer />

    <!-- bouton de retour au début (apparaît à la toute fin) -->
    <ReturnToStart @return="onReturn" />

    <!-- séquence d'introduction -->
    <IntroSequence v-if="showIntro" @engage="onEngage" />
  </div>
</template>
