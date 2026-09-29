/* ==================================================================
   SOUND - every effect is synthesised with WebAudio, so there are no
   audio files to load. The context is created on the first user
   gesture (browsers block audio before that). Muted in recruiter mode.
   ================================================================== */

import { store, isChaos } from './utils.js'

let ctx = null
let master = null
let noiseBuf = null
let enabled = store.get('sound', true)
const last = {}

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.32
    master.connect(ctx.destination)
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate)
    const data = noiseBuf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

const unlock = () => ensure()
addEventListener('pointerdown', unlock, { capture: true, passive: true })
addEventListener('keydown', unlock, { capture: true })

function tone({ freq = 440, to = null, type = 'sine', dur = 0.08, vol = 0.3, delay = 0 }) {
  const t = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.005)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g).connect(master)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

function noise({ dur = 0.05, vol = 0.2, freq = 2000, to = null, q = 1, type = 'bandpass', delay = 0 }) {
  const t = ctx.currentTime + delay
  const src = ctx.createBufferSource()
  const f = ctx.createBiquadFilter()
  const g = ctx.createGain()
  src.buffer = noiseBuf
  f.type = type
  f.Q.value = q
  f.frequency.setValueAtTime(freq, t)
  if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur)
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(f).connect(g).connect(master)
  src.start(t)
  src.stop(t + dur + 0.02)
}

const effects = {
  hover: () => tone({ freq: 2200, type: 'sine', dur: 0.025, vol: 0.04 }),
  click: () => tone({ freq: 720, to: 360, type: 'triangle', dur: 0.07, vol: 0.22 }),
  pop: () => tone({ freq: 320, to: 980, type: 'sine', dur: 0.1, vol: 0.28 }),
  drop: () => tone({ freq: 520, to: 140, type: 'sine', dur: 0.12, vol: 0.22 }),
  switch: () => { noise({ dur: 0.03, vol: 0.4, freq: 3500, q: 3 }); tone({ freq: 180, type: 'square', dur: 0.03, vol: 0.08 }) },
  tick: () => noise({ dur: 0.018, vol: 0.18, freq: 5000, q: 6 }),
  print: () => { noise({ dur: 0.04, vol: 0.12, freq: 1600, q: 2 }); tone({ freq: 90, type: 'sawtooth', dur: 0.04, vol: 0.03 }) },
  tear: () => noise({ dur: 0.35, vol: 0.35, freq: 800, to: 6000, q: 0.8 }),
  whoosh: () => noise({ dur: 0.4, vol: 0.2, freq: 300, to: 2400, q: 1.2 }),
  squash: () => { noise({ dur: 0.12, vol: 0.4, freq: 600, to: 120, type: 'lowpass' }); tone({ freq: 220, to: 50, type: 'square', dur: 0.12, vol: 0.1 }) },
  bonk: (v = 1) => tone({ freq: 160 + Math.random() * 120, to: 90, type: 'sine', dur: 0.08, vol: 0.05 + 0.2 * v }),
  success: () => { tone({ freq: 660, type: 'triangle', dur: 0.12, vol: 0.2 }); tone({ freq: 990, type: 'triangle', dur: 0.18, vol: 0.2, delay: 0.09 }) },
  nope: () => tone({ freq: 240, to: 160, type: 'square', dur: 0.14, vol: 0.08 }),
  chaos: () => {
    ;[0, 0.07, 0.14, 0.21].forEach((d, i) => tone({ freq: 400 + i * 180, type: 'square', dur: 0.08, vol: 0.08, delay: d }))
    noise({ dur: 0.6, vol: 0.25, freq: 200, to: 4000, delay: 0.2 })
  },
}

/* Throttle per effect so hover sweeps and pit collisions don't turn into noise. */
const minGap = { hover: 45, bonk: 40, tick: 25, print: 50 }

export function play(name, arg) {
  if (!enabled || !isChaos()) return
  // Hovers happen before any gesture; don't create the context for them.
  if (!ctx || ctx.state !== 'running') {
    if (name === 'hover' || name === 'bonk') return
    if (!ensure()) return
  }
  const now = performance.now()
  if (minGap[name] && now - (last[name] || 0) < minGap[name]) return
  last[name] = now
  effects[name]?.(arg)
}

export const sound = {
  get on() { return enabled },
  set(on) {
    enabled = on
    store.set('sound', on)
    document.documentElement.classList.toggle('sound-on', on && isChaos())
    if (on) { ensure(); play('success') }
  },
}
