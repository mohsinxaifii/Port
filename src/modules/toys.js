/* ==================================================================
   TOYS - the small stuff: static fills, local clock, copy-email,
   the runaway "Hire me" button, velocity marquee, light-switch cord
   and the gravity easter egg (type "mohsin" or the Konami code).
   ================================================================== */

import { gsap } from 'gsap'
import { $, $$, esc, finePointer, isChaos, reducedMotion, whileVisible } from './utils.js'
import { site } from '../data/site.js'
import { play } from './sound.js'
import { toast } from './toast.js'
import { toggleTheme } from './prefs.js'
import { lenis } from './scroll.js'

export function initToys() {
  fillStatic()
  initClock()
  initCopyEmail()
  initMarquee()
  initBadge()
  initCord()
  initEasterEgg()
  $$('.btn, .chip, .dir__row').forEach((b) => b.addEventListener('mouseenter', () => play('hover')))
}

function fillStatic() {
  if (!finePointer) $('.hero__hint').textContent = "↑ swipe through the name. it's wet."
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear() })
  fillDirectory()
}

function initClock() {
  const clock = $('[data-clock]')
  const status = $('[data-status]')
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: site.timezone, hour: '2-digit', minute: '2-digit' })
  const hourFmt = new Intl.DateTimeFormat('en-GB', { timeZone: site.timezone, hour: 'numeric', hourCycle: 'h23' })
  const update = () => {
    const now = new Date()
    clock.textContent = `${fmt.format(now)} ${site.tz}`
    const h = Number(hourFmt.format(now))
    // The status is the line recruiters scan for, so the late-night joke only
    // shows in chaos mode.
    status.textContent = h < 7 && isChaos() ? 'Probably asleep, still hireable' : site.status
  }
  update()
  setInterval(update, 15000)
}

// One clipped box per letter, so the value can roll on hover.
const roll = (text) => `<span class="dir__v" aria-label="${esc(text)}">${[...text].map((c, i) =>
  `<span class="roll" aria-hidden="true" style="--i:${i}"><span>${c === ' ' ? '&nbsp;' : esc(c)}</span></span>`).join('')}</span>`

/* Contact directory: one row per way to reach me. Email copies, the CV
   row downloads (printer.js binds [data-cv-download]), the rest link out. */
function fillDirectory() {
  const handle = (url) => url.replace(/^https?:\/\/(www\.)?[^/]+\//, '').replace(/\/$/, '')
  const social = (label) => site.socials.find((x) => x.label === label)
  const rows = [
    { key: 'Email', value: site.email, act: 'copy', attrs: 'type="button" data-copy-email', tag: 'button' },
    { key: 'WhatsApp', value: site.phone, act: 'chat ↗', attrs: `href="https://wa.me/${site.phone.replace(/\D/g, '')}" target="_blank" rel="noopener"` },
    ...['LinkedIn', 'GitHub'].map((l) => ({ key: l, value: handle(social(l).url), act: 'open ↗', attrs: `href="${esc(social(l).url)}" target="_blank" rel="noopener"` })),
    { key: 'CV', value: 'Download the PDF', act: 'pdf ↓', attrs: 'href="#" data-cv-download' },
  ]
  $('[data-directory]').innerHTML = rows.map((r) => {
    const tag = r.tag || 'a'
    return `<li><${tag} class="dir__row" ${r.attrs}>
      <span class="label dir__k">${r.key}</span>${roll(r.value)}<span class="label dir__act">${r.act}</span>
    </${tag}></li>`
  }).join('')
}

function initCopyEmail() {
  $('[data-copy-email]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      play('success')
      toast('copied, bestie ✦')
      const hint = $('[data-copy-email] .dir__act')
      hint.textContent = 'copied ✓'
      clearTimeout(hint.timer)
      hint.timer = setTimeout(() => { hint.textContent = 'copy' }, 2200)
    } catch {
      location.href = `mailto:${site.email}`
    }
  })
}

/* Dodges the cursor three times, then gives up. Only in chaos mode, only
   with a mouse - never on touch or keyboard. */
function initMarquee() {
  const row = $('[data-marquee-row]')
  // "Yalla, let's work" in Gulf Arabic, as the second beat of each loop.
  // The italic word rolls through a few verbs, every copy in step. The
  // track repeats the first word at the end so the loop can snap back.
  const WORDS = ['ships', 'sells', 'scales', 'converts', 'launches']
  const swap = `<span class="swap"><span class="swap__track">${[...WORDS, WORDS[0]].map((w) => `<em>${w}</em>`).join('')}</span></span>`
  const item = `<span class="marquee__item">Let's build something that ${swap} <span class="marquee__star">✦</span> <span class="ar" lang="ar" dir="rtl">يلا نشتغل</span> <span class="marquee__star">✦</span></span>`
  row.innerHTML = item.repeat(4)
  const first = row.firstElementChild
  // Open on the good part (the rolling word and يلا نشتغل), not a run of plain caps.
  let x = -Math.max(0, first.querySelector('.swap').offsetLeft - 32)

  if (!reducedMotion) {
    const slots = $$('.swap', row)
    const tracks = slots.map((s) => s.firstElementChild)
    // Each slot is as wide as the word showing, so the gaps either side
    // close up for "sells" and open for "converts" - eased by CSS.
    const widthOf = (n) => `${tracks[0].children[n].offsetWidth}px`
    const fit = (n) => slots.forEach((s) => { s.style.width = widthOf(n) })
    document.fonts?.ready.then(() => fit(0))
    fit(0)
    let i = 0
    setInterval(() => {
      i++
      fit(i)
      tracks.forEach((t) => { t.style.transition = ''; t.style.transform = `translateY(${-i * 1.4}em)` })
      if (i === WORDS.length) {
        setTimeout(() => {
          i = 0
          tracks.forEach((t) => { t.style.transition = 'none'; t.style.transform = 'translateY(0)' })
        }, 900)
      }
    }, 2200)
  }
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

/* Contact badge: the text ring turns slowly, faster while the page is
   moving (Lenis velocity), easing back after. */
function initBadge() {
  const ring = $('[data-badge-ring]')
  if (!ring || reducedMotion) return
  let a = 0
  let boost = 0
  const tick = (_t, dt) => {
    boost += (Math.min(Math.abs(lenis?.velocity || 0), 40) - boost) * 0.08
    a += (0.12 + boost * 0.12) * (dt / 16.67)
    ring.style.rotate = `${a}deg`
  }
  whileVisible($('[data-badge]'), () => gsap.ticker.add(tick), () => gsap.ticker.remove(tick))
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
