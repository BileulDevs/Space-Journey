import {
  AdditiveBlending, BackSide, Color, DoubleSide, Group, Mesh, NormalBlending, RingGeometry,
  ShaderMaterial, SphereGeometry, Vector3,
} from 'three'
import {
  planetVertex, planetFragment, cloudsVertex, cloudsFragment,
  atmosphereVertex, atmosphereFragment,
} from '../shaders/planet'

export interface PlanetConfig {
  position: Vector3
  radius: number
  type: 0 | 1 | 2 | 3 // 0 tellurique, 1 gazeuse, 2 rocheuse, 3 lave
  colorLow: string
  colorMid: string
  colorHigh: string
  atmosphere?: string // couleur (active la coquille atmosphérique)
  clouds?: boolean // couche de nuages animée (telluriques)
  nightLights?: boolean // lumières de villes sur la face nuit
  ring?: { inner: number; outer: number; color: string }
  rotationSpeed?: number
  tilt?: number
  segments?: number
}

export class Planet {
  group = new Group()
  private surfaceMat: ShaderMaterial
  private cloudsMat?: ShaderMaterial
  private cloudsMesh?: Mesh
  private spin: number
  private disposables: Array<{ dispose: () => void }> = []

  constructor(cfg: PlanetConfig, sunWorldPos: Vector3) {
    const seg = cfg.segments ?? 64
    this.spin = cfg.rotationSpeed ?? 0.04
    this.group.position.copy(cfg.position)
    this.group.rotation.z = cfg.tilt ?? 0.2

    const sunDir = sunWorldPos.clone().sub(cfg.position).normalize()

    // --- surface ---
    const geo = new SphereGeometry(cfg.radius, seg, seg)
    this.surfaceMat = new ShaderMaterial({
      vertexShader: planetVertex,
      fragmentShader: planetFragment,
      uniforms: {
        uTime: { value: 0 },
        uType: { value: cfg.type },
        uNight: { value: cfg.nightLights ? 1 : 0 },
        uSunDir: { value: sunDir },
        uColorLow: { value: new Color(cfg.colorLow) },
        uColorMid: { value: new Color(cfg.colorMid) },
        uColorHigh: { value: new Color(cfg.colorHigh) },
        uSeed: { value: Math.random() * 10 },
      },
    })
    const surface = new Mesh(geo, this.surfaceMat)
    this.group.add(surface)
    this.disposables.push(geo, this.surfaceMat)

    // --- nuages (optionnels) ---
    if (cfg.clouds) {
      const cGeo = new SphereGeometry(cfg.radius * 1.035, seg, seg)
      this.cloudsMat = new ShaderMaterial({
        vertexShader: cloudsVertex,
        fragmentShader: cloudsFragment,
        uniforms: {
          uTime: { value: 0 },
          uSunDir: { value: sunDir },
          uSeed: { value: Math.random() * 10 },
        },
        transparent: true,
        depthWrite: false,
        blending: NormalBlending,
      })
      this.cloudsMesh = new Mesh(cGeo, this.cloudsMat)
      this.group.add(this.cloudsMesh)
      this.disposables.push(cGeo, this.cloudsMat)
    }

    // --- atmosphère (optionnelle) ---
    if (cfg.atmosphere) {
      const atmoGeo = new SphereGeometry(cfg.radius * 1.18, seg, seg)
      const atmoMat = new ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        uniforms: {
          uSunDir: { value: sunDir },
          uColor: { value: new Color(cfg.atmosphere) },
        },
        transparent: true,
        side: BackSide,
        depthWrite: false,
        blending: AdditiveBlending,
      })
      this.group.add(new Mesh(atmoGeo, atmoMat))
      this.disposables.push(atmoGeo, atmoMat)
    }

    // --- anneau (Saturne, exoplanète annelée) ---
    if (cfg.ring) {
      const ringGeo = new RingGeometry(cfg.ring.inner, cfg.ring.outer, 128)
      const ringMat = new ShaderMaterial({
        transparent: true,
        side: DoubleSide,
        depthWrite: false,
        uniforms: {
          uColor: { value: new Color(cfg.ring.color) },
          uInner: { value: cfg.ring.inner },
          uOuter: { value: cfg.ring.outer },
          uSunDir: { value: sunDir },
        },
        vertexShader: /* glsl */ `
          varying vec3 vPos;
          varying vec3 vNormalW;
          void main(){
            vPos = position;
            vNormalW = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor; uniform float uInner; uniform float uOuter; uniform vec3 uSunDir;
          varying vec3 vPos; varying vec3 vNormalW;
          float hash(float n){ return fract(sin(n)*43758.5453); }
          void main(){
            float r = length(vPos.xy);
            float t = (r - uInner)/(uOuter - uInner);
            float bands = 0.55 + 0.45*sin(t*60.0) * step(0.5, hash(floor(t*22.0)));
            float edge = smoothstep(0.0,0.06,t) * smoothstep(1.0,0.9,t);
            float day = clamp(dot(normalize(vNormalW), normalize(uSunDir))*0.5+0.7, 0.2, 1.0);
            gl_FragColor = vec4(uColor*bands*day, bands*edge*0.8);
          }
        `,
      })
      const ring = new Mesh(ringGeo, ringMat)
      ring.rotation.x = Math.PI / 2
      this.group.add(ring)
      this.disposables.push(ringGeo, ringMat)
    }
  }

  update(elapsed: number, delta: number) {
    this.group.rotation.y += this.spin * delta
    this.surfaceMat.uniforms.uTime.value = elapsed
    if (this.cloudsMat && this.cloudsMesh) {
      this.cloudsMat.uniforms.uTime.value = elapsed
      // les nuages dérivent un peu plus vite que le sol
      this.cloudsMesh.rotation.y += this.spin * 0.35 * delta
    }
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose())
  }
}
