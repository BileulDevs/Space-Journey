<script setup lang="ts">
import { computed } from 'vue'
import { journeyHud } from '~/three/journeyState'
import { chapters } from '~/data/profile'

defineProps<{ muted: boolean }>()
const emit = defineEmits<{ nav: [id: string]; toggleAudio: [] }>()

const current = computed(() => chapters[journeyHud.chapterIndex] ?? chapters[0])
const pct = computed(() => Math.round(journeyHud.progress * 100))
const idx = computed(() => String(journeyHud.chapterIndex + 1).padStart(2, '0'))
const total = String(chapters.length).padStart(2, '0')
</script>

<template>
  <div v-show="journeyHud.started" class="hud" aria-hidden="false">
    <!-- barre haute : chapitre courant (gauche) · position (droite) -->
    <div class="hud__corner hud__corner--tl">
      <span class="hud__k">CHAPITRE</span>
      <span class="hud__v">{{ idx }} <i>/ {{ total }}</i></span>
      <span class="hud__label">{{ current.label }}</span>
    </div>
    <div class="hud__corner hud__corner--tr">
      <span class="hud__k">POSITION</span>
      <span class="hud__body">{{ current.body }}</span>
    </div>

    <!-- rail de trajectoire (droite) : chapitres cliquables -->
    <nav class="hud__rail" aria-label="Navigation des chapitres">
      <div class="hud__rail-track">
        <div class="hud__rail-fill" :style="{ height: pct + '%' }" />
        <button
          v-for="ch in chapters"
          :key="ch.id"
          class="hud__dot"
          :class="{ 'hud__dot--past': ch.index <= journeyHud.chapterIndex }"
          :style="{ top: (ch.index / (chapters.length - 1)) * 100 + '%' }"
          :title="ch.label"
          :aria-label="`Aller au chapitre ${ch.index + 1} — ${ch.label}`"
          @click="emit('nav', ch.id)"
        />
      </div>
      <span class="hud__rail-pct">{{ pct }}%</span>
    </nav>

    <!-- barre basse : télémétrie (gauche) · son (droite) -->
    <div class="hud__corner hud__corner--bl">
      <span class="hud__k">TRAJECTOIRE</span>
      <span class="hud__telemetry">NOMINALE · VITESSE STABLE</span>
    </div>
    <button class="hud__mute" @click="emit('toggleAudio')">
      {{ muted ? 'SON — OFF' : 'SON — ON' }}
    </button>
  </div>
</template>

<style scoped>
.hud {
  position: fixed;
  inset: 0;
  z-index: 6;
  pointer-events: none;
  font-family: var(--font-mono);
  color: var(--plasma);
}
.hud__corner {
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
  font-size: 0.66rem;
  letter-spacing: 0.18em;
}
/* coins ancrés aux bords de l'écran */
.hud__corner--tl { top: 1.5rem; left: 1.8rem; }
.hud__corner--tr { top: 1.5rem; right: 1.8rem; text-align: right; align-items: flex-end; }
.hud__corner--bl { bottom: 1.5rem; left: 1.8rem; }

.hud__k { color: var(--text-faint); letter-spacing: 0.28em; }
.hud__v { font-size: 1.05rem; color: var(--text); letter-spacing: 0.1em; }
.hud__v i { color: var(--text-faint); font-style: normal; font-size: 0.78rem; }
.hud__label { color: var(--ember); letter-spacing: 0.22em; text-transform: uppercase; }
.hud__body { color: var(--plasma-soft); font-size: 0.76rem; letter-spacing: 0.16em; }
.hud__telemetry { color: var(--text-dim); }

/* rail de trajectoire vertical, chapitres cliquables */
.hud__rail {
  position: fixed;
  top: 50%;
  right: 1.7rem;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
}
.hud__rail-track {
  position: relative;
  width: 2px;
  height: 38vh;
  background: var(--panel-line);
}
.hud__rail-fill {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  background: linear-gradient(var(--plasma), var(--ember));
}
.hud__dot {
  pointer-events: auto;
  position: absolute;
  left: 50%;
  width: 11px; height: 11px;
  padding: 0;
  transform: translate(-50%, -50%) rotate(45deg);
  border: 1px solid var(--plasma);
  background: var(--void);
  cursor: pointer;
  transition: background 0.3s var(--ease), transform 0.25s var(--ease), border-color 0.3s var(--ease);
}
.hud__dot--past { background: var(--plasma); }
.hud__dot:hover { transform: translate(-50%, -50%) rotate(45deg) scale(1.45); border-color: var(--ember); }
.hud__rail-pct { font-size: 0.62rem; color: var(--text-faint); letter-spacing: 0.1em; }

/* bouton son, dans la barre basse à droite */
.hud__mute {
  pointer-events: auto;
  position: fixed;
  bottom: 1.5rem;
  right: 1.8rem;
  background: none;
  border: none;
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.24em;
  cursor: pointer;
  transition: color 0.3s var(--ease);
}
.hud__mute:hover { color: #fff; }

@media (max-width: 720px) {
  .hud__rail { display: none; }
  .hud__corner { font-size: 0.58rem; }
  .hud__corner--tl, .hud__corner--bl { left: 1rem; }
  .hud__corner--tr { right: 1rem; }
  .hud__mute { right: 1rem; }
}
</style>
