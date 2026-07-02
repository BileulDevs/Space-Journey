/**
 * Passe « pellicule » finale : grain de film animé, vignettage doux,
 * aberration chromatique en périphérie, et stries radiales pendant le warp.
 * Appliquée en tout dernier (après tonemapping et FXAA).
 */
export const CinematicShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uWarp: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uWarp;
    varying vec2 vUv;

    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    void main(){
      vec2 uv = vUv;
      vec2 c = uv - 0.5;
      float r = length(c);

      // aberration chromatique radiale (accentuée pendant le warp)
      float ca = (0.0012 + uWarp * 0.007) * smoothstep(0.05, 0.8, r);
      vec3 col;
      col.r = texture2D(tDiffuse, uv + c * ca).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - c * ca).b;

      // stries de vitesse radiales pendant le warp
      if(uWarp > 0.015){
        vec3 acc = col;
        for(int i = 1; i <= 5; i++){
          float s = 1.0 - float(i) * 0.028 * uWarp;
          acc += texture2D(tDiffuse, vec2(0.5) + c * s).rgb;
        }
        col = mix(col, acc / 6.0, clamp(uWarp * 0.85, 0.0, 0.85));
      }

      // vignettage
      float vig = smoothstep(0.92, 0.32, r);
      col *= mix(0.68, 1.0, vig);

      // grain de film
      float g = hash(uv * vec2(1920.0, 1080.0) + fract(uTime) * 60.0);
      col += (g - 0.5) * 0.035;

      gl_FragColor = vec4(col, 1.0);
    }
  `,
}
