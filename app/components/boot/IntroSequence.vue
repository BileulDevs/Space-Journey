<script setup lang="ts">
import { onMounted, ref } from 'vue'

const emit = defineEmits<{ engage: [] }>()

const phase = ref(0) // 0 boot, 1 countdown, 2 ready
const count = ref(3)
const leaving = ref(false)

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const lines = [
  'SYSTÈMES DE NAVIGATION ........ EN LIGNE',
  'RÉACTEUR ....................... STABLE',
  'TRAJECTOIRE .............. VERROUILLÉE',
]

onMounted(() => {
  if (reduced) {
    phase.value = 2
    return
  }
  setTimeout(() => (phase.value = 1), 1800)
  setTimeout(() => {
    const tick = setInterval(() => {
      count.value -= 1
      if (count.value <= 0) {
        clearInterval(tick)
        phase.value = 2
      }
    }, 900)
  }, 1800)
})

function engage() {
  leaving.value = true
  emit('engage')
}
</script>

<template>
  <div class="intro" :class="{ 'intro--leaving': leaving }">
    <div class="intro__inner">
      <p class="intro__id">MISSION PORTFOLIO — ÉDITION ORBITALE</p>

      <h1 class="intro__name">BILEL<br>SAHRAOUI</h1>
      <p class="intro__tag">Un voyage à travers mon univers</p>

      <ul class="intro__lines">
        <li v-for="(l, i) in lines" :key="i" :style="{ animationDelay: `${0.5 + i * 0.4}s` }">
          {{ l }}
        </li>
      </ul>

      <div v-if="phase === 1" class="intro__count" :key="count">
        <svg viewBox="0 0 100 100" class="intro__ring" aria-hidden="true">
          <circle cx="50" cy="50" r="46" />
        </svg>
        <span>{{ count }}</span>
      </div>

      <transition name="fade">
        <div v-if="phase === 2" class="intro__ready">
          <p class="intro__engine">MOTEUR EN MARCHE</p>
          <button class="btn btn--primary intro__cta" @click="engage">
            Entrer dans la simulation
          </button>
          <p class="intro__hint">🎧 Casque recommandé · Le scroll pilote le vaisseau</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.intro {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  background:
    radial-gradient(ellipse 90% 60% at 50% 30%, rgba(20, 30, 55, 0.5), transparent 70%),
    var(--void);
  transition: opacity 1.2s var(--ease);
}
.intro--leaving { opacity: 0; pointer-events: none; }

.intro__inner {
  text-align: center;
  font-family: var(--font-mono);
  color: var(--text-dim);
  padding: 2rem;
}
.intro__id {
  font-size: var(--step--1);
  letter-spacing: 0.4em;
  color: var(--plasma);
  margin-bottom: 2.4rem;
  opacity: 0;
  animation: fadeUp 1s var(--ease) 0.15s forwards;
}
.intro__name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(3rem, 11vw, 7.5rem);
  line-height: 0.94;
  letter-spacing: -0.01em;
  color: var(--text);
  opacity: 0;
  animation: fadeUp 1.2s var(--ease) 0.35s forwards;
}
.intro__tag {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: var(--step-1);
  color: var(--ember);
  margin-top: 1rem;
  opacity: 0;
  animation: fadeUp 1.1s var(--ease) 0.7s forwards;
}
.intro__lines {
  list-style: none;
  font-size: var(--step--1);
  letter-spacing: 0.12em;
  margin-top: 2.4rem;
}
.intro__lines li {
  opacity: 0;
  margin: 0.35rem 0;
  animation: lineIn 0.6s var(--ease) forwards;
}
@keyframes lineIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 0.65; transform: none; } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

.intro__count {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 6.4rem;
  height: 6.4rem;
  margin-top: 2.2rem;
}
.intro__count span {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 2.6rem;
  color: var(--text);
}
.intro__ring {
  position: absolute;
  inset: 0;
  transform: rotate(-90deg);
}
.intro__ring circle {
  fill: none;
  stroke: var(--plasma);
  stroke-width: 1.6;
  stroke-dasharray: 289;
  stroke-dashoffset: 289;
  animation: ringSweep 0.9s linear forwards;
  opacity: 0.8;
}
@keyframes ringSweep { to { stroke-dashoffset: 0; } }

.intro__ready { margin-top: 2.4rem; }
.intro__engine {
  font-size: var(--step--1);
  letter-spacing: 0.32em;
  color: var(--ember);
  margin-bottom: 1.4rem;
}
.intro__cta { font-size: var(--step-0); }
.intro__hint {
  margin-top: 1.6rem;
  font-size: var(--step--1);
  letter-spacing: 0.16em;
  color: var(--text-faint);
}

.fade-enter-active { transition: opacity 0.8s var(--ease); }
.fade-enter-from { opacity: 0; }
</style>
