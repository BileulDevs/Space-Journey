import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { camProxy, journeyHud } from '~/three/journeyState'
import { STATIONS, INTRO_STATION } from '~/three/camera/stations'

/**
 * Orchestration du voyage :
 * - Lenis pilote le scroll (synchronisé avec le ticker GSAP)
 * - une timeline GSAP scrubbée par ScrollTrigger déplace la caméra (camProxy)
 *   entre les stations, en passant par des waypoints `via` → arcs de travelling
 * - enveloppe de warp + coup de focale (FOV) au trou de ver
 * - révélation des panneaux, navigation vers un chapitre (HUD)
 */
export function useScrollJourney() {
  let lenis: Lenis | null = null
  let masterST: ScrollTrigger | null = null
  let tickerFn: ((t: number) => void) | null = null
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function setup() {
    gsap.registerPlugin(ScrollTrigger)

    // position initiale (intro)
    Object.assign(camProxy, {
      px: INTRO_STATION.p[0], py: INTRO_STATION.p[1], pz: INTRO_STATION.p[2],
      tx: INTRO_STATION.t[0], ty: INTRO_STATION.t[1], tz: INTRO_STATION.t[2],
      warp: 0, fov: 62,
    })

    if (!reduced) {
      lenis = new Lenis({
        autoRaf: false,        // on pilote depuis le ticker GSAP (une seule boucle)
        duration: 1.4,
        syncTouch: false,
        wheelMultiplier: 0.9,
      })
      lenis.stop() // verrouillé jusqu'au lancement
      lenis.on('scroll', ScrollTrigger.update)
      tickerFn = (time: number) => lenis?.raf(time * 1000)
      gsap.ticker.add(tickerFn)
      gsap.ticker.lagSmoothing(0)

      // révélations de contenu
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
        })
      })
    }
  }

  /**
   * Timeline caméra alignée sur la position réelle des sections (mesurée dans
   * le DOM). Chaque station est atteinte quand sa section est lue ; la dernière
   * (galaxie) est atteinte en avance puis MAINTENUE jusqu'en bas.
   */
  function buildCameraTimeline() {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.chapter'))
    const range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const vh = window.innerHeight

    const at: number[] = sections.map((sec, i) => {
      if (i === 0) return 0
      const center = sec.offsetTop + sec.offsetHeight / 2 - vh / 2
      return Math.min(1, Math.max(0, center / range))
    })
    if (at.length > 1) {
      const last = sections[sections.length - 1]
      const earlier = (last.offsetTop + last.offsetHeight * 0.22 - vh / 2) / range
      at[at.length - 1] = Math.min(0.95, Math.max(at[at.length - 2] + 0.04, earlier))
    }

    const tl = gsap.timeline({ defaults: { ease: 'power1.inOut' } })
    for (let i = 1; i < STATIONS.length; i++) {
      const s = STATIONS[i]
      const d = Math.max(0.02, at[i] - at[i - 1])
      const t0 = at[i - 1]
      // la visée glisse sur tout le segment…
      tl.to(camProxy, {
        tx: s.t[0], ty: s.t[1], tz: s.t[2],
        duration: d, ease: 'power1.inOut',
      }, t0)
      // …la position passe par le waypoint (arc de travelling) si défini
      if (s.via) {
        tl.to(camProxy, {
          px: s.via[0], py: s.via[1], pz: s.via[2],
          duration: d * 0.5, ease: 'power1.in',
        }, t0)
        tl.to(camProxy, {
          px: s.p[0], py: s.p[1], pz: s.p[2],
          duration: d * 0.5, ease: 'power1.out',
        }, t0 + d * 0.5)
      } else {
        tl.to(camProxy, {
          px: s.p[0], py: s.p[1], pz: s.p[2],
          duration: d, ease: 'power1.inOut',
        }, t0)
      }
    }
    // maintien sur la galaxie jusqu'à la fin (durée totale = 1.0)
    const lastAt = at[STATIONS.length - 1]
    tl.to({ h: 0 }, { h: 1, duration: Math.max(0.02, 1 - lastAt) }, lastAt)

    // enveloppe de warp + coup de focale au trou de ver (station 3)
    const wAt = at[3] ?? 0.42
    tl.to(camProxy, { warp: 1, fov: 76, duration: 0.05, ease: 'power2.in' }, Math.max(0, wAt - 0.05))
    tl.to(camProxy, { warp: 0, fov: 62, duration: 0.08, ease: 'power2.out' }, wAt + 0.02)

    masterST = ScrollTrigger.create({
      animation: tl,
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        journeyHud.progress = self.progress
        let idx = 0
        for (let i = 0; i < at.length; i++) if (self.progress >= at[i] - 0.03) idx = i
        journeyHud.chapterIndex = idx
      },
    })
    ScrollTrigger.refresh()
  }

  /** Lancement : envol intro → première station, puis déverrouille le scroll. */
  function start() {
    journeyHud.started = true

    if (reduced) {
      Object.assign(camProxy, {
        px: STATIONS[0].p[0], py: STATIONS[0].p[1], pz: STATIONS[0].p[2],
        tx: STATIONS[0].t[0], ty: STATIONS[0].t[1], tz: STATIONS[0].t[2],
        fov: 55,
      })
      buildCameraTimeline()
      return
    }

    const s0 = STATIONS[0]
    gsap.timeline()
      .to(camProxy, { warp: 0.5, duration: 0.6, ease: 'power2.in' }, 0)
      .to(camProxy, {
        px: s0.p[0], py: s0.p[1], pz: s0.p[2],
        tx: s0.t[0], ty: s0.t[1], tz: s0.t[2],
        fov: 55,
        duration: 3.2, ease: 'power3.inOut',
      }, 0)
      .to(camProxy, { warp: 0, duration: 1.2, ease: 'power2.out' }, 1.0)
      .add(() => {
        buildCameraTimeline()
        lenis?.start()
      })
  }

  /** Fait défiler jusqu'au chapitre `id` (le panneau arrive centré). */
  function scrollToSection(id: string) {
    const sec = document.getElementById(id)
    if (!sec) return
    const target = sec.offsetTop + Math.max(0, (sec.offsetHeight - window.innerHeight) / 2)
    if (lenis) lenis.scrollTo(target, { duration: 1.8 })
    else window.scrollTo({ top: target, behavior: 'smooth' })
  }

  /** Ramène en haut en douceur — la caméra rembobine le voyage. */
  function scrollToTop() {
    if (lenis) lenis.scrollTo(0, { duration: 2.2 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function destroy() {
    masterST?.kill()
    ScrollTrigger.getAll().forEach((st) => st.kill())
    if (tickerFn) gsap.ticker.remove(tickerFn)
    lenis?.destroy()
    lenis = null
  }

  return { setup, start, destroy, scrollToTop, scrollToSection }
}
