export const $ = (sel, root = document) => root.querySelector(sel)
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]

export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
))

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
export const lerp = (a, b, t) => a + (b - a) * t

export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches

// localStorage can throw (private mode, blocked storage) - never let it break the page.
export const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key)
      return v == null ? fallback : JSON.parse(v)
    } catch { return fallback }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  },
}

export const isChaos = () => document.documentElement.dataset.mode !== 'recruiter'

/* Run `start` while `el` is on screen and `stop` when it leaves. */
export function whileVisible(el, start, stop, margin = '100px') {
  const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { rootMargin: margin })
  io.observe(el)
  return io
}

/* Deterministic barcode bars so the same code always prints the same pattern. */
export function barcode(seed, count = 34) {
  let s = [...String(seed)].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
  return Array.from({ length: count }, () => `<i style="width:${1 + Math.floor(rnd() * 3)}px"></i>`).join('')
}
