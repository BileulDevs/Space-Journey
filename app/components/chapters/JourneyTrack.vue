<script setup lang="ts">
import { chapters } from '~/data/chapters'
</script>

<template>
  <!-- Piste de scroll vide : chaque section ne sert qu'à donner sa longueur
       au trajet caméra (et de cible à la navigation du HUD). -->
  <div class="journey" aria-hidden="true">
    <section
      v-for="ch in chapters"
      :id="ch.id"
      :key="ch.id"
      class="chapter"
      :class="{ 'chapter--wide': ch.wide }"
    />
  </div>
</template>
