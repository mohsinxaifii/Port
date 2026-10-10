/* ==================================================================
   HERO - the name as a liquid. The wordmark is drawn to a 2D canvas,
   uploaded as a texture, and pushed around by an OGL flowmap that
   follows the pointer. Colour fringes (lime + pink) appear where the
   flow is strongest. When nobody is touching it, a "ghost" pointer
   drifts through so it never looks static. Every few seconds the name
   pours between Arabic (محسن, shown first) and Latin, a wavy wipe that ripples the
   liquid as it passes. Falls back to the plain <h1> if WebGL isn't
   available.
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
  uniform sampler2D tMap2;
  uniform sampler2D tFlow;
  uniform float uMix;
  uniform vec3 uInk;
  uniform vec3 uA;
  uniform vec3 uB;
  uniform float uTime;
  varying vec2 vUv;

  // 0 = Latin, 1 = Arabic. A wavy front sweeps across as uMix runs 0 -> 1.
  float wipe() {
    float edge = vUv.x + 0.12 * sin(vUv.y * 10.0 + uTime * 2.0);
    return smoothstep(edge - 0.1, edge + 0.1, uMix * 1.6 - 0.3);
  }

  void main() {
    float t = wipe();
    float crest = 1.0 - abs(t * 2.0 - 1.0);

    vec3 flow = texture2D(tFlow, vUv).rgb;
    vec2 f = flow.xy * flow.z + vec2(0.0, sin(vUv.x * 28.0 + uTime * 5.0) * 0.18 * crest);
    vec2 uv = vUv - f * 0.14;
    uv.x += sin(vUv.y * 9.0 + uTime * 1.1) * 0.0012;

    float r = mix(texture2D(tMap, uv + f * 0.06).a, texture2D(tMap2, uv + f * 0.06).a, t);
    float g = mix(texture2D(tMap, uv).a, texture2D(tMap2, uv).a, t);
    float b = mix(texture2D(tMap, uv - f * 0.06).a, texture2D(tMap2, uv - f * 0.06).a, t);

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

export async function initHero(text, textAr) {
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

  try {
    await Promise.all([
      document.fonts.load('600 100px Geist'),
      textAr && document.fonts.load(`700 100px "Reem Kufi"`, textAr),
    ])
  } catch {}

  const flowmap = new Flowmap(gl, { size: 256, falloff: 0.22, dissipation: 0.94, alpha: 0.6 })
  const texture = new Texture(gl, { generateMipmaps: false })
  const texture2 = new Texture(gl, { generateMipmaps: false })
  const textCanvas = document.createElement('canvas')
  const textCanvas2 = document.createElement('canvas')

  const program = new Program(gl, {
    vertex,
    fragment,
    transparent: true,
    depthTest: false,
    uniforms: {
      tMap: { value: texture },
      tMap2: { value: texture2 },
      // Opens on the Arabic name; the timeline below pours it into Latin.
      uMix: { value: textAr && !reducedMotion ? 1 : 0 },
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

  // Fit a word to the canvas: as wide as the gutters allow, at most 80%
  // of the height. Arabic letters join, so it gets no negative tracking.
  function drawWord(target, tex, word, arabic) {
    const dpr = renderer.dpr
    const W = Math.max(1, Math.round(w * dpr))
    const H = Math.max(1, Math.round(h * dpr))
    target.width = W
    target.height = H
    const c = target.getContext('2d')
    const pad = parseFloat(getComputedStyle(wrap.parentElement.querySelector('.container')).paddingLeft) * dpr

    const setFont = (size) => {
      c.font = arabic
        ? `700 ${size}px "Reem Kufi", "Noto Kufi Arabic", sans-serif`
        : `600 ${size}px Geist, system-ui, sans-serif`
      if ('letterSpacing' in c) c.letterSpacing = arabic ? '0px' : `${-0.065 * size}px`
      c.direction = arabic ? 'rtl' : 'ltr'
      c.textAlign = 'left'
    }
    const lines = [word]
    const LEAD = 0.9

    setFont(100)
    const ms = lines.map((l) => c.measureText(l))
    const capH = Math.max(...ms.map((m) => m.actualBoundingBoxAscent + m.actualBoundingBoxDescent))
    const inkW = Math.max(...ms.map((m) => m.actualBoundingBoxLeft + m.actualBoundingBoxRight))
    const inkH = capH + (lines.length - 1) * capH * (1 + (1 - LEAD))
    // Arabic's tall ascenders and deep descenders need more air than caps.
    const size = Math.min((100 * (W - pad * 2)) / inkW, (100 * H * (arabic ? 0.72 : 0.8)) / inkH)
    setFont(size)

    c.clearRect(0, 0, W, H)
    c.fillStyle = '#fff'
    const step = (capH * size / 100) * (2 - LEAD)
    const blockH = step * (lines.length - 1)
    lines.forEach((line, i) => {
      const m = c.measureText(line)
      const x = (W - (m.actualBoundingBoxLeft + m.actualBoundingBoxRight)) / 2 + m.actualBoundingBoxLeft
      const y = (H + m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2 - blockH / 2 + i * step
      c.fillText(line, x, y)
    })
    tex.image = target
    tex.needsUpdate = true
  }

  function drawText() {
    drawWord(textCanvas, texture, text.toUpperCase(), false)
    drawWord(textCanvas2, texture2, textAr || text.toUpperCase(), Boolean(textAr))
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

  // Arabic -> Latin -> Arabic, holding each long enough to read.
  if (textAr && !reducedMotion) {
    gsap.timeline({ repeat: -1, delay: 3.2, repeatDelay: 3.2 })
      .to(program.uniforms.uMix, { value: 0, duration: 1.6, ease: 'power2.inOut' })
      .to(program.uniforms.uMix, { value: 1, duration: 1.6, ease: 'power2.inOut' }, '+=3.2')
  }

  document.documentElement.classList.add('has-gl')
}
