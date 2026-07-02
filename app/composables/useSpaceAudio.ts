import { ref } from 'vue'
import { camProxy } from '~/three/journeyState'

/**
 * Ambiance sonore synthétisée (Web Audio, aucun fichier audio) :
 * - drone grave (oscillateurs superposés + filtre passe-bas qui respire)
 * - lit de souffle filtré très discret
 * - « warp » : le souffle monte en fréquence et en volume avec camProxy.warp
 *
 * Démarrée uniquement sur le geste utilisateur (clic « Entrer ») — requis par
 * les politiques d'autoplay. Échec silencieux si l'audio est indisponible.
 */
export function useSpaceAudio() {
  const muted = ref(false)
  let ctx: AudioContext | null = null
  let master: GainNode | null = null
  let warpGain: GainNode | null = null
  let warpFilter: BiquadFilterNode | null = null
  let poll: number | null = null
  let started = false
  const LEVEL = 0.14

  function start() {
    if (started || typeof window === 'undefined') return
    started = true
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      ctx = new AC()
      master = ctx.createGain()
      master.gain.value = 0
      master.connect(ctx.destination)

      // --- drone : trois partiels à travers un passe-bas qui respire ---
      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 260
      lp.Q.value = 0.6
      lp.connect(master)

      const partials: Array<[OscillatorType, number, number]> = [
        ['triangle', 48, 0.16],
        ['sine', 96.4, 0.07],
        ['sine', 144.2, 0.03],
      ]
      for (const [type, freq, g] of partials) {
        const o = ctx.createOscillator()
        o.type = type
        o.frequency.value = freq
        const gg = ctx.createGain()
        gg.gain.value = g
        o.connect(gg)
        gg.connect(lp)
        o.start()
      }
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.06
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 70
      lfo.connect(lfoGain)
      lfoGain.connect(lp.frequency)
      lfo.start()

      // --- lit de souffle (bruit blanc bouclé, très filtré) ---
      const nbuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
      const data = nbuf.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
      const noise = ctx.createBufferSource()
      noise.buffer = nbuf
      noise.loop = true

      const nlp = ctx.createBiquadFilter()
      nlp.type = 'lowpass'
      nlp.frequency.value = 380
      const ng = ctx.createGain()
      ng.gain.value = 0.05
      noise.connect(nlp)
      nlp.connect(ng)
      ng.connect(master)

      // --- branche warp : le même bruit → passe-bande balayé ---
      warpFilter = ctx.createBiquadFilter()
      warpFilter.type = 'bandpass'
      warpFilter.frequency.value = 300
      warpFilter.Q.value = 1.2
      warpGain = ctx.createGain()
      warpGain.gain.value = 0
      noise.connect(warpFilter)
      warpFilter.connect(warpGain)
      warpGain.connect(master)
      noise.start()

      // fondu d'entrée (allumage moteur)
      master.gain.setTargetAtTime(muted.value ? 0 : LEVEL, ctx.currentTime, 1.2)

      // suit l'intensité du warp (lecture directe de l'état partagé)
      poll = window.setInterval(() => {
        if (!ctx || !warpGain || !warpFilter) return
        const w = camProxy.warp
        const t = ctx.currentTime
        warpGain.gain.setTargetAtTime(w * 0.5, t, 0.08)
        warpFilter.frequency.setTargetAtTime(300 + w * 2600, t, 0.1)
      }, 80)
    } catch (err) {
      console.warn('[cosmos] audio indisponible :', err)
    }
  }

  /** Coupe / rétablit le son. Retourne l'état muet. */
  function toggle() {
    muted.value = !muted.value
    if (ctx && master) {
      master.gain.setTargetAtTime(muted.value ? 0 : LEVEL, ctx.currentTime, 0.15)
    }
    return muted.value
  }

  function destroy() {
    if (poll) clearInterval(poll)
    poll = null
    try { ctx?.close() } catch { /* noop */ }
    ctx = null
    started = false
  }

  return { start, toggle, destroy, muted }
}
