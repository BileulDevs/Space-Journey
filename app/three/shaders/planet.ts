import { noiseGLSL } from './noise.glsl'

/**
 * Planète procédurale générique, éclairée par une direction solaire (uSunDir).
 * uType : 0 tellurique · 1 géante gazeuse · 2 rocheuse · 3 monde de lave.
 * uNight : 1 → lumières de villes sur la face nuit (telluriques habitées).
 * Aucune texture externe : tout est généré par bruit.
 */

export const planetVertex = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vPosL;
varying vec3 vViewDir;
void main(){
  vPosL = position;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`

export const planetFragment = /* glsl */ `
${noiseGLSL}
uniform float uTime;
uniform int uType;
uniform int uNight;
uniform vec3 uSunDir;     // direction (monde) vers le soleil
uniform vec3 uColorLow;
uniform vec3 uColorMid;
uniform vec3 uColorHigh;
uniform float uSeed;
varying vec3 vNormalW;
varying vec3 vPosL;
varying vec3 vViewDir;

void main(){
  vec3 n = normalize(vPosL);
  vec3 col;
  float spec = 0.0;
  float land = 0.0;
  vec3 emissive = vec3(0.0);

  if(uType == 0){
    // --- Tellurique : continents fbm, calottes polaires ---
    float h = fbm(n * 2.4 + uSeed);
    h = h * 0.5 + 0.5;
    land = smoothstep(0.5, 0.56, h);
    vec3 ocean = uColorLow;
    vec3 ground = mix(uColorMid, uColorHigh, smoothstep(0.56, 0.85, h));
    col = mix(ocean, ground, land);
    float ice = smoothstep(0.78, 0.95, abs(n.y));
    col = mix(col, vec3(0.92, 0.96, 1.0), ice);
    spec = (1.0 - land) * 0.5; // reflet spéculaire sur l'eau
  } else if(uType == 1){
    // --- Géante gazeuse : bandes latitudinales tourbillonnantes ---
    float bands = sin(n.y * 9.0 + fbm(n * 1.3 + vec3(uTime * 0.02, uSeed, 0.0)) * 2.2);
    float t = bands * 0.5 + 0.5;
    col = mix(uColorLow, uColorMid, t);
    col = mix(col, uColorHigh, smoothstep(0.7, 1.0, fbm(n * 3.0 + uSeed)));
  } else if(uType == 2){
    // --- Rocheuse : poussière + cratères ---
    float h = fbm(n * 3.2 + uSeed) * 0.5 + 0.5;
    col = mix(uColorLow, uColorMid, h);
    float craters = smoothstep(0.42, 0.4, abs(fbm(n * 6.0 + uSeed * 2.0)));
    col = mix(col, uColorHigh, craters * 0.4);
  } else {
    // --- Monde de lave : croûte sombre, veines incandescentes ---
    float h = fbm(n * 3.0 + uSeed) * 0.5 + 0.5;
    col = mix(uColorLow, uColorMid, h);
    float veins = smoothstep(0.86, 0.97, 1.0 - abs(snoise(n * 5.0 + uSeed * 3.0 + vec3(0.0, 0.0, uTime * 0.03))));
    float pools = pow(max(fbm(n * 2.0 + uSeed) - 0.15, 0.0), 2.0);
    emissive = vec3(1.0, 0.32, 0.05) * (veins * 2.2 + pools * 1.2);
  }

  // Éclairage (Lambert + terminateur doux)
  float ndl = dot(normalize(vNormalW), normalize(uSunDir));
  float day = smoothstep(-0.25, 0.35, ndl);
  vec3 lit = col * (0.22 + day * 1.05);

  // Lumières de villes sur la face nuit (agrégats sur les continents)
  if(uNight == 1){
    float cities = smoothstep(0.7, 0.94, fbm(n * 13.0 + uSeed * 4.0));
    float night = 1.0 - smoothstep(-0.18, 0.12, ndl);
    lit += vec3(1.0, 0.72, 0.38) * cities * land * night * 1.5;
  }

  // Spéculaire (eau) côté jour
  vec3 h2 = normalize(normalize(uSunDir) + vViewDir);
  float s = pow(max(dot(normalize(vNormalW), h2), 0.0), 60.0) * spec * day;
  lit += vec3(0.7, 0.85, 1.0) * s;

  // Rim atmosphérique froid sur le limbe éclairé
  float rim = pow(1.0 - max(dot(vNormalW, vViewDir), 0.0), 3.0);
  lit += vec3(0.25, 0.5, 0.9) * rim * day * 0.6;

  // La lave brille aussi dans le noir
  lit += emissive;

  gl_FragColor = vec4(lit, 1.0);
}
`

/** Couche de nuages animée (sphère légèrement plus grande, fondu normal). */
export const cloudsVertex = planetVertex

export const cloudsFragment = /* glsl */ `
${noiseGLSL}
uniform float uTime;
uniform vec3 uSunDir;
uniform float uSeed;
varying vec3 vNormalW;
varying vec3 vPosL;
varying vec3 vViewDir;

void main(){
  vec3 n = normalize(vPosL);
  float c = fbm(n * 2.6 + vec3(uTime * 0.008, 0.0, uTime * 0.005) + uSeed);
  float cov = smoothstep(0.12, 0.62, c * 0.5 + 0.5);

  float ndl = dot(normalize(vNormalW), normalize(uSunDir));
  float day = smoothstep(-0.2, 0.35, ndl);

  vec3 col = vec3(1.0) * (0.14 + day * 1.0);
  float alpha = cov * (0.12 + day * 0.85) * 0.9;
  gl_FragColor = vec4(col, alpha);
}
`

/** Coquille atmosphérique additive, teintée crépuscule au terminateur. */
export const atmosphereVertex = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vViewDir;
void main(){
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`

export const atmosphereFragment = /* glsl */ `
uniform vec3 uSunDir;
uniform vec3 uColor;
varying vec3 vNormalW;
varying vec3 vViewDir;
void main(){
  float ndl = dot(normalize(vNormalW), normalize(uSunDir));
  float fres = pow(1.0 - max(dot(vNormalW, vViewDir), 0.0), 2.6);
  float day = smoothstep(-0.3, 0.4, ndl);
  // liseré chaud au terminateur (couchers de soleil orbitaux)
  float twilight = smoothstep(0.0, 0.18, ndl) * (1.0 - smoothstep(0.18, 0.5, ndl));
  vec3 col = mix(uColor, vec3(1.0, 0.45, 0.22), twilight * 0.85);
  float a = fres * (0.25 + day * 0.85);
  gl_FragColor = vec4(col, a);
}
`
