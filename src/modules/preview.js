/* ==================================================================
   PREVIEW - a floating screenshot that follows the cursor over the
   archive list. It bends and colour-splits with cursor velocity and
   cross-fades between projects. One fixed full-screen canvas, only
   rendering while visible.
   ================================================================== */

import { Renderer, Program, Mesh, Plane, Texture } from 'ogl'
import { gsap } from 'gsap'
import { $, lerp } from './utils.js'

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec2 uv;
  uniform vec2 uRes;
  uniform vec2 uPos;
  uniform vec2 uSize;
  uniform vec2 uVel;
  uniform float uScale;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    float bend = sin(uv.y * 3.14159);
    p.x -= uVel.x * 0.0009 * bend;
    p.y += uVel.y * 0.0009 * sin(uv.x * 3.14159);
    vec2 px = uPos + vec2(p.x, -p.y) * uSize * uScale;
    vec2 clip = px / uRes * 2.0 - 1.0;
    gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  }
`

const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D tA;
  uniform sampler2D tB;
  uniform float uMix;
  uniform float uAlpha;
  uniform vec2 uVel;
  uniform vec2 uSize;
  varying vec2 vUv;

  vec3 split(sampler2D t, vec2 uv, vec2 o) {
    return vec3(texture2D(t, uv + o).r, texture2D(t, uv).g, texture2D(t, uv - o).b);
  }

  void main() {
    vec2 o = uVel * 0.00025;
    vec3 col = mix(split(tA, vUv, o), split(tB, vUv, o), uMix);

    // rounded corners
    float r = 14.0;
    vec2 q = abs(vUv - 0.5) * uSize - (uSize * 0.5 - r);
    float d = length(max(q, 0.0)) - r;
    float mask = 1.0 - smoothstep(-1.0, 1.0, d);

    gl_FragColor = vec4(col, uAlpha * mask);
  }
`

export function initPreview() {
  const canvas = $('[data-preview]')
  let renderer
  try {
    renderer = new Renderer({ canvas, dpr: Math.min(devicePixelRatio, 2), alpha: true })
  } catch {
    return null
  }
  const gl = renderer.gl
  if (!gl) return null

  const textures = new Map()
  const load = (src) => {
    if (textures.has(src)) return textures.get(src)
    const tex = new Texture(gl, { generateMipmaps: false })
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => { tex.image = img }
    img.src = src
    textures.set(src, tex)
    return tex
  }
  const blank = new Texture(gl)

  const size = [400, 250]
  const program = new Program(gl, {
    vertex,
    fragment,
    transparent: true,
    depthTest: false,
    uniforms: {
      tA: { value: blank },
      tB: { value: blank },
      uMix: { value: 1 },
      uAlpha: { value: 0 },
      uScale: { value: 0.6 },
      uRes: { value: [innerWidth, innerHeight] },
      uPos: { value: [0, 0] },
      uSize: { value: size },
      uVel: { value: [0, 0] },
    },
  })
  const mesh = new Mesh(gl, { geometry: new Plane(gl, { widthSegments: 16, heightSegments: 16 }), program })
  mesh.frustumCulled = false

  const resize = () => {
    renderer.setSize(innerWidth, innerHeight)
    program.uniforms.uRes.value = [innerWidth, innerHeight]
    const w = Math.min(420, innerWidth * 0.28)
    size[0] = w
    size[1] = w * 10 / 16
  }
  addEventListener('resize', resize)
  resize()

  const target = { x: innerWidth / 2, y: innerHeight / 2 }
  const pos = { x: target.x, y: target.y }
  const vel = { x: 0, y: 0 }
  addEventListener('pointermove', (e) => { target.x = e.clientX; target.y = e.clientY }, { passive: true })

  let visible = false
  let running = false
  const tick = () => {
    const nx = lerp(pos.x, target.x + size[0] * 0.15, 0.14)
    const ny = lerp(pos.y, target.y, 0.14)
    vel.x = lerp(vel.x, (nx - pos.x) * 12, 0.2)
    vel.y = lerp(vel.y, (ny - pos.y) * 12, 0.2)
    pos.x = nx
    pos.y = ny
    const u = program.uniforms
    u.uPos.value = [pos.x, pos.y]
    u.uVel.value = [vel.x, vel.y]
    renderer.render({ scene: mesh })
    if (!visible && u.uAlpha.value < 0.001) { running = false; gsap.ticker.remove(tick) }
  }
  const run = () => { if (!running) { running = true; gsap.ticker.add(tick) } }

  let current = null
  return {
    preload(srcs) { srcs.forEach(load) },
    show(src) {
      const u = program.uniforms
      if (!visible) { pos.x = target.x; pos.y = target.y }
      visible = true
      run()
      if (src !== current) {
        u.tA.value = u.uAlpha.value > 0.05 ? u.tB.value : load(src)
        u.tB.value = load(src)
        u.uMix.value = 0
        gsap.to(u.uMix, { value: 1, duration: 0.5, ease: 'power2.out', overwrite: true })
        current = src
      }
      gsap.to(u.uAlpha, { value: 1, duration: 0.35, overwrite: true })
      gsap.to(u.uScale, { value: 1, duration: 0.6, ease: 'expo.out', overwrite: true })
    },
    hide() {
      visible = false
      const u = program.uniforms
      gsap.to(u.uAlpha, { value: 0, duration: 0.3, overwrite: true })
      gsap.to(u.uScale, { value: 0.7, duration: 0.4, overwrite: true })
    },
  }
}
