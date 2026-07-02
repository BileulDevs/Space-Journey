import {
  AdditiveBlending, BackSide, Mesh, ShaderMaterial, SphereGeometry, Vector3,
} from 'three'
import { noiseGLSL } from '../shaders/noise.glsl'

/**
 * Voie lactée — bande galactique subtile en toile de fond, pour que l'espace
 * « vide » ait de la matière. Sphère géante vue de l'intérieur, additive.
 */
export class MilkyWay {
  mesh: Mesh
  private mat: ShaderMaterial
  private geo: SphereGeometry

  constructor(center: Vector3) {
    this.geo = new SphereGeometry(1600, 48, 48)
    this.mat = new ShaderMaterial({
      side: BackSide,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main(){
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        ${noiseGLSL}
        varying vec3 vDir;
        void main(){
          vec3 d = vDir;
          // bande : plan incliné de la galaxie
          vec3 axis = normalize(vec3(0.32, 1.0, 0.18));
          float band = exp(-pow(dot(d, axis), 2.0) * 16.0);
          // nuages stellaires + veines de poussière sombre
          float clouds = fbm(d * 3.2) * 0.5 + 0.5;
          float lanes = smoothstep(0.34, 0.52, fbm(d * 6.0 + 3.7)) * 0.75 + 0.25;
          // cœur galactique chaud dans une direction
          float core = pow(max(dot(d, normalize(vec3(0.55, 0.05, -0.83))), 0.0), 4.0);
          vec3 cool = vec3(0.35, 0.47, 0.80);
          vec3 warm = vec3(0.95, 0.72, 0.48);
          vec3 col = mix(cool, warm, clamp(clouds * 0.4 + core * 0.9, 0.0, 1.0));
          float intensity = band * clouds * lanes * (0.10 + core * 0.16);
          gl_FragColor = vec4(col * intensity, intensity);
        }
      `,
    })
    this.mesh = new Mesh(this.geo, this.mat)
    this.mesh.position.copy(center)
    this.mesh.renderOrder = -2
    this.mesh.frustumCulled = false
  }

  dispose() {
    this.geo.dispose()
    this.mat.dispose()
  }
}
