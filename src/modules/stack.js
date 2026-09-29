/* ==================================================================
   STACK - the skills list (always visible) and the ball pit (chaos
   mode). Every skill is a ball, coloured by category. A legend above
   the pit highlights one category; hovering or grabbing a ball shows
   its full name; sweeping the cursor through pushes balls around.

   Physics is a tiny hand-rolled circle sim: gravity, wall bounces,
   ball-ball impulses, pointer drag-and-throw. DOM balls keep labels
   crisp; only transforms change per frame.
   ================================================================== */

import { gsap } from 'gsap'
import { $, $$, esc, clamp, whileVisible, isChaos, finePointer } from './utils.js'
import { pit as groups } from '../data/cv.js'
import { play } from './sound.js'

export function initStack() {
  $('[data-skills]').innerHTML = groups.map((g) => `
    <div class="skills__group" data-reveal>
      <h3 class="label"><span class="swatch swatch--${g.tone}"></span>${esc(g.group)}</h3>
      <ul>${g.items.map((s) => `<li class="tag">${esc(s.full)}</li>`).join('')}</ul>
    </div>`).join('')

  initPit()
}

function initPit() {
  const box = $('[data-pit]')
  const legend = $('[data-pit-legend]')
  const caption = $('[data-pit-caption]')
  const total = groups.reduce((n, g) => n + g.items.length, 0)
  $('[data-pit-count]').textContent = `${total} skills in the pit`

  // ---- legend ----
  legend.innerHTML = groups.map((g, i) => `
    <button class="chip chip--legend" type="button" data-group="${i}" aria-pressed="false">
      <span class="swatch swatch--${g.tone}"></span>${esc(g.group)}<sup>${g.items.length}</sup>
    </button>`).join('')

  // ---- balls ----
  const balls = []
  groups.forEach((g, gi) => g.items.forEach((item) => {
    const el = document.createElement('div')
    el.className = `ball ball--${g.tone}`
    el.setAttribute('aria-hidden', 'true')
    // Two lines for multi-word labels so text stays big inside the circle.
    const words = item.label.split(' ')
    const lines = words.length > 1 && item.label.length > 9
      ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')]
      : [item.label]
    el.innerHTML = lines.map((l) => `<span>${esc(l)}</span>`).join('')
    box.appendChild(el)
    balls.push({ el, item, group: gi, lines, x: 0, y: -9999, vx: 0, vy: 0, r: 40, angle: 0, dragged: false })
  }))

  let W = 1
  let H = 1
  function size() {
    W = box.clientWidth || 1
    H = box.clientHeight || 1
    // Balls cover ~40% of the pit's area; random packing makes that settle
    // at about two-thirds full, leaving headroom to throw.
    const base = Math.sqrt((W * H * 0.4) / (Math.PI * balls.length))
    balls.forEach((b) => {
      const longest = Math.max(...b.lines.map((l) => l.length))
      b.r = base * clamp(0.82 + longest * 0.035, 0.85, 1.25)
      const fs = Math.min(b.r * 0.36, (b.r * 1.55) / (longest * 0.58))
      b.el.style.width = b.el.style.height = `${b.r * 2}px`
      b.el.style.fontSize = `${fs}px`
      b.x = clamp(b.x, b.r, W - b.r)
      b.y = Math.min(b.y, H - b.r)
    })
  }
  new ResizeObserver(size).observe(box)

  const drop = () => {
    // Shuffle so categories fall mixed, then stack them above the pit.
    const order = [...balls].sort(() => Math.random() - 0.5)
    order.forEach((b, i) => {
      b.x = b.r + Math.random() * (W - b.r * 2)
      b.y = -b.r - i * (b.r * 0.9) - Math.random() * 40
      b.vx = (Math.random() - 0.5) * 3
      b.vy = 0
    })
  }

  // ---- physics ----
  const G = 0.45
  const WALL = 0.45
  const E = 0.5
  const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, over: false }
  let held = null

  function step(k) {
    for (const b of balls) {
      if (b.dragged) {
        b.vx = (pointer.x - b.x) * 0.35
        b.vy = (pointer.y - b.y) * 0.35
      } else {
        b.vy += G * k
        b.vx *= 0.995
        b.vy *= 0.995
        // Cursor wind: a fast sweep shoves nearby balls.
        if (pointer.over && !held) {
          const dx = b.x - pointer.x
          const dy = b.y - pointer.y
          const reach = b.r + 70
          const d2 = dx * dx + dy * dy
          const speed = Math.hypot(pointer.vx, pointer.vy)
          if (d2 < reach * reach && speed > 2) {
            const d = Math.sqrt(d2) || 1
            const f = (1 - d / reach) * Math.min(speed, 40) * 0.05 * k
            b.vx += (dx / d) * f + pointer.vx * 0.02 * k
            b.vy += (dy / d) * f + pointer.vy * 0.02 * k
          }
        }
      }
      b.x += b.vx * k
      b.y += b.vy * k

      if (b.y + b.r > H) {
        b.y = H - b.r
        if (b.vy > 3) play('bonk', Math.min(1, b.vy / 18))
        b.vy *= -WALL
        b.vx *= 0.94
      }
      if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx) * WALL }
      if (b.x + b.r > W) { b.x = W - b.r; b.vx = -Math.abs(b.vx) * WALL }
      if (b.y < -H * 2) { b.y = -H * 2; b.vy = Math.abs(b.vy) * 0.2 }
    }

    for (let i = 0; i < balls.length; i++) {
      const a = balls[i]
      for (let j = i + 1; j < balls.length; j++) {
        const c = balls[j]
        const dx = c.x - a.x
        const dy = c.y - a.y
        const min = a.r + c.r
        if (Math.abs(dx) >= min || Math.abs(dy) >= min) continue
        const d2 = dx * dx + dy * dy
        if (d2 >= min * min || d2 === 0) continue
        const d = Math.sqrt(d2)
        const nx = dx / d
        const ny = dy / d
        // Dragged balls act as immovable.
        const ia = a.dragged ? 0 : 1 / (a.r * a.r)
        const ic = c.dragged ? 0 : 1 / (c.r * c.r)
        const sum = ia + ic || 1
        const overlap = min - d
        a.x -= nx * overlap * (ia / sum)
        a.y -= ny * overlap * (ia / sum)
        c.x += nx * overlap * (ic / sum)
        c.y += ny * overlap * (ic / sum)

        const vn = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny
        if (vn < 0) {
          const jImp = (-(1 + E) * vn) / sum
          a.vx -= jImp * ia * nx
          a.vy -= jImp * ia * ny
          c.vx += jImp * ic * nx
          c.vy += jImp * ic * ny
          if (vn < -6) play('bonk', Math.min(1, -vn / 20))
        }
      }
    }
  }

  function draw() {
    for (const b of balls) {
      b.angle += (b.vx / b.r) * 0.9
      b.el.style.transform = `translate3d(${b.x - b.r}px, ${b.y - b.r}px, 0) rotate(${b.angle}rad)`
    }
  }

  const tick = (_t, dt) => {
    const k = clamp(dt / 16.67, 0.25, 2) / 3
    step(k)
    step(k)
    step(k)
    draw()
    pointer.vx *= 0.8
    pointer.vy *= 0.8
  }

  // ---- pointer: caption, wind, drag & throw ----
  const setCaption = (b) => {
    caption.innerHTML = b
      ? `<span class="swatch swatch--${groups[b.group].tone}"></span><b>${esc(b.item.full)}</b><span class="pit__cap-group">${esc(groups[b.group].group)}</span>`
      : finePointer ? 'hover a ball to read it · grab to throw' : 'tap a ball to read it · drag to throw'
  }
  setCaption(null)

  const toLocal = (e) => {
    const r = box.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    if (pointer.over) { pointer.vx = x - pointer.x; pointer.vy = y - pointer.y }
    pointer.x = x
    pointer.y = y
  }
  const ballOf = (t) => balls.find((b) => b.el === t.closest?.('.ball'))

  box.addEventListener('pointerenter', (e) => { toLocal(e); pointer.over = true })
  box.addEventListener('pointerleave', () => { pointer.over = false; if (!held) setCaption(null) })
  box.addEventListener('pointermove', (e) => {
    toLocal(e)
    if (!held && e.pointerType === 'mouse') setCaption(ballOf(e.target) || null)
  })
  box.addEventListener('pointerdown', (e) => {
    const b = ballOf(e.target)
    if (!b) return
    e.preventDefault()
    held = b
    b.dragged = true
    b.el.classList.add('is-drag')
    box.setPointerCapture(e.pointerId)
    toLocal(e)
    setCaption(b)
    play('pop')
  })
  const release = () => {
    if (!held) return
    held.dragged = false
    held.el.classList.remove('is-drag')
    held = null
    play('drop')
  }
  box.addEventListener('pointerup', release)
  box.addEventListener('pointercancel', release)
  $$('.ball', box).forEach((el) => el.addEventListener('pointerenter', () => play('hover')))

  // ---- legend: highlight a category and make it jump ----
  let active = -1
  legend.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-group]')
    if (!btn) return
    const gi = Number(btn.dataset.group)
    active = active === gi ? -1 : gi
    $$('[data-group]', legend).forEach((c) => {
      const on = Number(c.dataset.group) === active
      c.classList.toggle('is-active', on)
      c.setAttribute('aria-pressed', String(on))
    })
    balls.forEach((b) => {
      b.el.classList.toggle('is-dim', active !== -1 && b.group !== active)
      if (b.group === active) {
        b.vy -= 9 + Math.random() * 7
        b.vx += (Math.random() - 0.5) * 8
      }
    })
    play(active === -1 ? 'drop' : 'whoosh')
  })

  $('[data-pit-shake]').addEventListener('click', () => {
    balls.forEach((b) => {
      b.vy -= 10 + Math.random() * 10
      b.vx += (Math.random() - 0.5) * 22
    })
    play('whoosh')
  })

  // ---- run only while visible, in chaos mode ----
  let running = false
  let dropped = false
  const start = () => {
    if (running || !isChaos()) return
    if (!dropped) { dropped = true; size(); drop() }
    running = true
    gsap.ticker.add(tick)
  }
  const stop = () => { running = false; gsap.ticker.remove(tick) }
  whileVisible(box, start, stop, '0px')
  addEventListener('modechange', () => {
    if (!isChaos()) return stop()
    // The pit was display:none; wait a frame for it to have a size.
    requestAnimationFrame(() => {
      const r = box.getBoundingClientRect()
      if (r.top < innerHeight && r.bottom > 0) start()
    })
  })
  draw()
}
