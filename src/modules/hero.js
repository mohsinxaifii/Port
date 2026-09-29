/* ==================================================================
   HERO - the name as a liquid. The wordmark is drawn to a 2D canvas,
   uploaded as a texture, and pushed around by an OGL flowmap that
   follows the pointer. Colour fringes (lime + pink) appear where the
   flow is strongest. When nobody is touching it, a "ghost" pointer
   drifts through so it never looks static. Falls back to the plain
   <h1> if WebGL isn't available.
   ================================================================== */

import { Renderer, Program, Mesh, Triangle, Texture, Flowmap, Vec2 } from 'ogl'
import { gsap } from 'gsap'
import { $, whileVisible, reducedMotion } from './utils.js'

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`

const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D tMap;
  uniform sampler2D tFlow;
  uniform vec3 uInk;
  uniform vec3 uA;
  uniform vec3 uB;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec3 flow = texture2D(tFlow, vUv).rgb;
    vec2 f = flow.xy * flow.z;
    vec2 uv = vUv - f * 0.14;
    uv.x += sin(vUv.y * 9.0 + uTime * 1.1) * 0.0012;

    float r = texture2D(tMap, uv + f * 0.06).a;
    float g = texture2D(tMap, uv).a;
    float b = texture2D(tMap, uv - f * 0.06).a;

    float fr = clamp(r - g, 0.0, 1.0);
    float fb = clamp(b - g, 0.0, 1.0);
    float a = clamp(g + fr + fb, 0.0, 1.0);
    vec3 col = (uInk * g + uA * fr + uB * fb) / max(a, 0.001);
    gl_FragColor = vec4(col, a);
  }
`

const hexToVec = (hex) => {
  const h = hex.trim().replace('#', '')
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16)
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]
}
const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name)

export async function initHero(text) {
  const wrap = $('[data-hero]')
  const canvas = $('[data-hero-gl]')

  let renderer
  try {
    renderer = new Renderer({ canvas, dpr: Math.min(devicePixelRatio, 2), alpha: true })
  } catch {
    return
  }
  const gl = renderer.gl
  if (!gl) return

  try { await document.fonts.load('600 100px Geist') } catch {}

  const flowmap = new Flowmap(gl, { size: 256, falloff: 0.22, dissipation: 0.94, alpha: 0.6 })
  const texture = new Texture(gl, { generateMipmaps: false })
  const textCanvas = document.createElement('canvas')

  const program = new Program(gl, {
    vertex,
    fragment,
    transparent: true,
    depthTest: false,
    uniforms: {
      tMap: { value: texture },
      tFlow: flowmap.uniform,
      uInk: { value: hexToVec(cssVar('--ink')) },
      uA: { value: hexToVec(cssVar('--accent')) },
      uB: { value: hexToVec(cssVar('--pink')) },
      uTime: { value: 0 },
    },
  })
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

  let w = 1
  let h = 1

  function drawText() {
    const dpr = renderer.dpr
    const W = Math.max(1, Math.round(w * dpr))
    const H = Math.max(1, Math.round(h * dpr))
    textCanvas.width = W
    textCanvas.height = H
    const c = textCanvas.getContext('2d')
    const word = text.toUpperCase()
    const pad = parseFloat(getComputedStyle(wrap.parentElement.querySelector('.container')).paddingLeft) * dpr

    const setFont = (size) => {
      c.font = `600 ${size}px Geist, system-ui, sans-serif`
      if ('letterSpacing' in c) c.letterSpacing = `${-0.065 * size}px`
    }
    setFont(100)
    let m = c.measureText(word)
    const inkW = m.actualBoundingBoxLeft + m.actualBoundingBoxRight
    const inkH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
    const size = Math.min((100 * (W - pad * 2)) / inkW, (100 * H * 0.8) / inkH)
    setFont(size)
    m = c.measureText(word)

    const x = (W - (m.actualBoundingBoxLeft + m.actualBoundingBoxRight)) / 2 + m.actualBoundingBoxLeft
    const y = (H + m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2
    c.clearRect(0, 0, W, H)
    c.fillStyle = '#fff'
    c.fillText(word, x, y)
    texture.image = textCanvas
    texture.needsUpdate = true
  }

  function resize() {
    const rect = wrap.getBoundingClientRect()
    w = rect.width
    h = rect.height * 1.12
    renderer.setSize(w, h)
    flowmap.aspect = w / h
    drawText()
  }
  new ResizeObserver(resize).observe(wrap)
  resize()

  addEventListener('themechange', () => {
    program.uniforms.uInk.value = hexToVec(cssVar('--ink'))
  })

  // ---- pointer ----
  const mouse = new Vec2(-1)
  const velocity = new Vec2()
  const lastMouse = new Vec2()
  let lastTime = 0
  let lastInput = -Infinity
  let moved = false

  function feed(clientX, clientY, isGhost = false) {
    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    if (!isGhost) lastInput = performance.now()
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return
    mouse.set(x / rect.width, 1 - y / rect.height)

    const now = performance.now()
    if (!lastTime) { lastTime = now; lastMouse.set(x, y) }
    const dt = Math.max(14, now - lastTime)
    velocity.x = (x - lastMouse.x) / dt
    velocity.y = (y - lastMouse.y) / dt
    lastMouse.set(x, y)
    lastTime = now
    moved = true
  }
  const section = wrap.closest('section')
  section.addEventListener('pointermove', (e) => feed(e.clientX, e.clientY))
  section.addEventListener('touchmove', (e) => feed(e.touches[0].clientX, e.touches[0].clientY), { passive: true })

  // ---- loop ----
  let running = false
  const tick = (time) => {
    program.uniforms.uTime.value = time

    // Ghost pointer after a few idle seconds (skipped for reduced motion).
    if (!reducedMotion && performance.now() - lastInput > 2600) {
      const rect = canvas.getBoundingClientRect()
      const t = time * 0.55
      feed(
        rect.left + rect.width * (0.5 + 0.42 * Math.sin(t)),
        rect.top + rect.height * (0.5 + 0.28 * Math.sin(t * 1.9)),
        true,
      )
    }

    if (!moved) { mouse.set(-1); velocity.set(0) }
    moved = false
    flowmap.mouse.copy(mouse)
    flowmap.velocity.lerp(velocity, velocity.len() ? 0.15 : 0.1)
    flowmap.update()
    renderer.render({ scene: mesh })
  }

  whileVisible(
    section,
    () => { if (!running) { running = true; gsap.ticker.add(tick) } },
    () => { running = false; gsap.ticker.remove(tick) },
    '0px',
  )

  document.documentElement.classList.add('has-gl')
}
