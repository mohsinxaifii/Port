import { writeFileSync } from 'node:fs'
import { encodePNG } from './png.mjs'

/* ------------------------------------------------------------------
   Tileable paper-fibre texture.

   Laid over the whole site at 30% opacity with mix-blend-mode:multiply,
   so it needs to read as near-white with sparse darker fibre — anything
   heavier turns the paper muddy. Built from wrapped value noise (so the
   tile seams are invisible) plus a sparse pass of directional fibres.
------------------------------------------------------------------ */

const SIZE = 1024

// Deterministic PRNG so the texture is reproducible across builds.
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Value-noise lattice that wraps at `period`, so the tile is seamless. */
function makeNoise(period, rand) {
  const g = new Float32Array(period * period)
  for (let i = 0; i < g.length; i++) g[i] = rand()
  const smooth = (t) => t * t * (3 - 2 * t)
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y)
    const xf = smooth(x - xi), yf = smooth(y - yi)
    const at = (a, b) => g[(((b % period) + period) % period) * period + (((a % period) + period) % period)]
    const top = at(xi, yi) + (at(xi + 1, yi) - at(xi, yi)) * xf
    const bot = at(xi, yi + 1) + (at(xi + 1, yi + 1) - at(xi, yi + 1)) * xf
    return top + (bot - top) * yf
  }
}

const rand = mulberry32(20260903)
const octaves = [
  { period: 8,   scale: 8 / SIZE,   amp: 0.55 },
  { period: 32,  scale: 32 / SIZE,  amp: 0.28 },
  { period: 128, scale: 128 / SIZE, amp: 0.12 },
  { period: 256, scale: 256 / SIZE, amp: 0.05 },
].map((o) => ({ ...o, noise: makeNoise(o.period, rand) }))

const field = new Float32Array(SIZE * SIZE)
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    let v = 0
    for (const o of octaves) v += o.noise(x * o.scale, y * o.scale) * o.amp
    field[y * SIZE + x] = v
  }
}

/* Sparse fibres: short directional strokes, the visual signature of
   uncoated stock. Drawn darker than the field and slightly blurred by
   accumulating with falloff along the stroke. */
const fibreRand = mulberry32(77123)
for (let i = 0; i < 2600; i++) {
  const len = 12 + fibreRand() * 90
  const angle = fibreRand() * Math.PI * 2
  const dx = Math.cos(angle), dy = Math.sin(angle)
  const strength = 0.05 + fibreRand() * 0.16
  let x = fibreRand() * SIZE, y = fibreRand() * SIZE
  for (let s = 0; s < len; s++) {
    const falloff = Math.sin((s / len) * Math.PI) // fade both ends
    const px = ((Math.round(x) % SIZE) + SIZE) % SIZE
    const py = ((Math.round(y) % SIZE) + SIZE) % SIZE
    field[py * SIZE + px] -= strength * falloff
    x += dx; y += dy
  }
}

/* Flecks: tiny dark inclusions, very sparse. */
const fleckRand = mulberry32(4242)
for (let i = 0; i < 900; i++) {
  const px = Math.floor(fleckRand() * SIZE)
  const py = Math.floor(fleckRand() * SIZE)
  field[py * SIZE + px] -= 0.18 + fleckRand() * 0.3
}

// Normalise, then compress into the light end of the range.
let min = Infinity, max = -Infinity
for (const v of field) { if (v < min) min = v; if (v > max) max = v }

const rgb = new Uint8Array(SIZE * SIZE * 3)
for (let i = 0; i < field.length; i++) {
  const n = (field[i] - min) / (max - min)          // 0..1
  const lum = 216 + n * 39                           // 216..255 — light only
  const c = Math.max(0, Math.min(255, Math.round(lum)))
  rgb[i * 3] = c
  rgb[i * 3 + 1] = c
  rgb[i * 3 + 2] = Math.max(0, c - 2)                // faintest warm cast
}

writeFileSync(new URL('../public/textures/paper.png', import.meta.url), encodePNG(rgb, SIZE, SIZE))
console.log(`paper.png  ${SIZE}x${SIZE}`)
