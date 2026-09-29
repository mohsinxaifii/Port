/* ==================================================================
   TOYS - the small stuff: static fills, Dubai clock, copy-email,
   the runaway "Hire me" button, velocity marquee, light-switch cord
   and the gravity easter egg (type "mohsin" or the Konami code).
   ================================================================== */

import { gsap } from 'gsap'
import { $, $$, esc, finePointer, isChaos, reducedMotion } from './utils.js'
import { site } from '../data/site.js'
import { play } from './sound.js'
import { toast } from './toast.js'
import { toggleTheme } from './prefs.js'
import { lenis } from './scroll.js'

export function initToys() {
  fillStatic()
  initClock()
  initCopyEmail()
  initHire()
  initMarquee()
  initCord()
  initEasterEgg()
  $$('.btn, .chip, .socials a').forEach((b) => b.addEventListener('mouseenter', () => play('hover')))
}

function fillStatic() {
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear() })
  $('[data-roles]').innerHTML = site.roles.map((r) => `<li>${esc(r)}</li>`).join('')
  $('[data-email-text]').textContent = site.email
  $('[data-socials]').innerHTML = site.socials
    .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)} ↗</a></li>`)
    .join('') + `<li><a href="tel:${esc(site.phone.replace(/[^\d+]/g, ''))}">${esc(site.phone)}</a></li>`
}

function initClock() {
  const clock = $('[data-clock]')
  const status = $('[data-status]')
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: site.timezone, hour: '2-digit', minute: '2-digit' })
  const hourFmt = new Intl.DateTimeFormat('en-GB', { timeZone: site.timezone, hour: 'numeric', hourCycle: 'h23' })
  const update = () => {
    const now = new Date()
    clock.textContent = `Dubai ${fmt.format(now)}`
    const h = Number(hourFmt.format(now))
    status.textContent = h < 7 ? 'Probably asleep, still hireable' : 'Available for work'
  }
  update()
  setInterval(update, 15000)
}

function initCopyEmail() {
  $('[data-copy-email]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      play('success')
      toast('copied, bestie ✦')
    } catch {
      location.href = `mailto:${site.email}`
    }
  })
}

/* Dodges the cursor three times, then gives up. Only in chaos mode, only
   with a mouse - never on touch or keyboard. */
function initHire() {
  const btn = $('[data-hire]')
  const label = btn.firstChild
  btn.href = `mailto:${site.email}?subject=Let's%20work%20together`
  const lines = ['nope', 'too slow', 'ok ok, one more']
  let dodges = 0

  btn.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse' || !isChaos() || dodges >= lines.length) return
    const r = btn.getBoundingClientRect()
    let dx = (90 + Math.random() * 90) * (Math.random() < 0.5 ? -1 : 1)
    const dy = (30 + Math.random() * 50) * (Math.random() < 0.5 ? -1 : 1)
    if (r.left + dx < 16 || r.right + dx > innerWidth - 16) dx = -dx
    const [cx, cy] = (btn.style.translate || '0px 0px').split(' ').map(parseFloat)
    btn.style.translate = `${(cx || 0) + dx}px ${(cy || 0) + dy}px`
    label.textContent = `${lines[dodges]} `
    dodges++
    play('nope')
    if (dodges === lines.length) {
      setTimeout(() => {
        btn.style.translate = '0px 0px'
        label.textContent = 'ok fine, hire me 🫠 '
        play('success')
      }, 700)
    }
  })

  addEventListener('modechange', () => {
    dodges = 0
    btn.style.translate = ''
    label.textContent = 'Hire me '
  })
}

function initMarquee() {
  const row = $('[data-marquee-row]')
  const item = `<span class="marquee__item">Let's build something that <em>ships</em> <span class="marquee__star">✦</span></span>`
  row.innerHTML = item.repeat(4)
  const first = row.firstElementChild
  let x = 0
  let dir = 1
  let skew = 0
  const setX = gsap.quickSetter(row, 'x', 'px')
  const setSkew = gsap.quickSetter(row, 'skewX', 'deg')

  const tick = (_t, dt) => {
    const w = first.offsetWidth
    const v = lenis?.velocity || 0
    if (v > 0.5) dir = 1
    else if (v < -0.5) dir = -1
    const k = dt / 16.67
    x -= (reducedMotion ? 0 : 1.2 + Math.min(Math.abs(v) * 0.6, 24)) * dir * k
    if (x <= -w) x += w
    if (x > 0) x -= w
    skew += ((-v * 0.25) - skew) * 0.1
    setX(x)
    setSkew(Math.max(-10, Math.min(10, skew)))
  }
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)))
  io.observe(row)
}

function initCord() {
  const cord = $('[data-cord]')
  let startY = null
  let pulled = 0
  let suppress = false

  const flip = () => {
    play('switch')
    toggleTheme()
  }

  cord.addEventListener('pointerdown', (e) => {
    startY = e.clientY
    pulled = 0
    cord.setPointerCapture(e.pointerId)
  })
  cord.addEventListener('pointermove', (e) => {
    if (startY == null) return
    pulled = Math.max(0, Math.min(90, e.clientY - startY))
    gsap.set(cord, { y: pulled * 0.7 })
  })
  const release = () => {
    if (startY == null) return
    startY = null
    if (pulled > 28) { flip(); suppress = true }
    gsap.to(cord, { y: 0, duration: 0.9, ease: 'elastic.out(1.2, .3)' })
  }
  cord.addEventListener('pointerup', release)
  cord.addEventListener('pointercancel', release)
  cord.addEventListener('click', () => {
    if (suppress) { suppress = false; return }
    gsap.fromTo(cord, { y: 26 }, { y: 0, duration: 0.9, ease: 'elastic.out(1.2, .3)' })
    flip()
  })
  cord.addEventListener('mouseenter', () => {
    if (finePointer) gsap.fromTo(cord, { rotation: 6 }, { rotation: 0, duration: 1.4, ease: 'elastic.out(1, .2)' })
  })
}

function initEasterEgg() {
  const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
  let keys = []
  let typed = ''
  let busy = false

  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    keys = [...keys, e.key].slice(-konami.length)
    typed = (typed + (e.key.length === 1 ? e.key.toLowerCase() : '')).slice(-6)
    if (typed === 'mohsin' || keys.join() === konami.join()) {
      typed = ''
      keys = []
      gravity()
    }
  })

  function gravity() {
    if (busy || !isChaos() || reducedMotion) return
    busy = true
    play('chaos')
    toast('gravity.exe has stopped working', 3000)
    const targets = $$('.h2, .card, .pass, .odo, .sticker, .hero__pitch, .hero__meta, .btn, .row, .skills__group, .printer, .contact__title, .email')
      .filter((el) => {
        const r = el.getBoundingClientRect()
        return r.bottom > 0 && r.top < innerHeight && r.width > 0
      })
    targets.forEach((el) => {
      const r = el.getBoundingClientRect()
      el.classList.add('is-falling')
      gsap.to(el, {
        y: innerHeight - r.bottom - 8 + Math.random() * 6,
        rotation: (Math.random() - 0.5) * 50,
        duration: 0.9 + Math.random() * 0.7,
        ease: 'bounce.out',
        delay: Math.random() * 0.25,
      })
    })
    setTimeout(() => {
      gsap.to(targets, {
        y: 0,
        rotation: 0,
        duration: 1.2,
        ease: 'elastic.out(1, .5)',
        stagger: 0.02,
        clearProps: 'transform',
        onComplete: () => targets.forEach((el) => el.classList.remove('is-falling')),
      })
      setTimeout(() => { busy = false }, 1600)
      play('pop')
    }, 3000)
  }
}
