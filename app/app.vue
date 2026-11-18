<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useScrollJourney } from '~/composables/useScrollJourney'
import { useSpaceAudio } from '~/composables/useSpaceAudio'
import SpaceExperience from '~/components/SpaceExperience.vue'

const journey = useScrollJourney()
const audio = useSpaceAudio()
const audioMuted = audio.muted

// L'audio exige un geste utilisateur : on le démarre à la première interaction.
const GESTURES = ['pointerdown', 'keydown', 'touchend'] as const
function startAudioOnGesture() {
  audio.start()
  GESTURES.forEach((g) => window.removeEventListener(g, startAudioOnGesture))
}

function onNav(id: string) {
  journey.scrollToSection(id)
}

function onToggleAudio() {
  audio.toggle()
}

onMounted(() => {
  journey.setup()
  journey.start()
  GESTURES.forEach((g) => window.addEventListener(g, startAudioOnGesture))
})

onBeforeUnmount(() => {
  GESTURES.forEach((g) => window.removeEventListener(g, startAudioOnGesture))
  journey.destroy()
  audio.destroy()
})
</script>

<template>
  <div>
    <ClientOnly>
      <SpaceExperience />
    </ClientOnly>

    <MissionHud :muted="audioMuted" @nav="onNav" @toggle-audio="onToggleAudio" />

    <JourneyTrack />
  </div>
</template>
