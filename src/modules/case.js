/* ==================================================================
   CASE - full-screen case-study overlay. Opens from any [data-open]
   link, deep-links as #p-<slug>, supports Esc / arrow keys, and wipes
   in with a clip-path so the page never navigates away.
   ================================================================== */

import { gsap } from 'gsap'
import { $, esc } from './utils.js'
import { projects } from '../data/projects.js'
import { categoryOf, browserFrame, hostOf as host } from './work.js'
import { stopScroll, startScroll } from './scroll.js'
import { play } from './sound.js'

let el
let currentIdx = -1
let opener = null


function render(i) {
  const p = projects[i]
  const n = projects.length
  const next = projects[(i + 1) % n]
  el.innerHTML = `
    <div class="case__bar">
      <span class="label">(${String(i + 1).padStart(2, '0')}/${n}) ${esc(categoryOf(p))}</span>
      <div class="case__nav">
        <button class="btn btn--sm btn--line" type="button" data-case-step="-1" aria-label="Previous project">←</button>
        <button class="btn btn--sm btn--line" type="button" data-case-step="1" aria-label="Next project">→</button>
        <button class="btn btn--sm btn--ink" type="button" data-case-close>Close ✕</button>
      </div>
    </div>

    <div class="container">
      <header class="case__head">
        <p class="label">${esc(p.role)}</p>
        <h2 class="case__title">${esc(p.title)}</h2>
        <dl class="case__meta">
          <div><dt class="label">Client</dt><dd>${esc(p.client)}</dd></div>
          <div><dt class="label">Type</dt><dd>${esc(categoryOf(p))}</dd></div>
          <div><dt class="label">Stack</dt><dd>${p.stack.map(esc).join(', ')}</dd></div>
          <div><dt class="label">Live site</dt><dd><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(host(p.url))} ↗</a></dd></div>
        </dl>
      </header>

      <figure class="case__hero">${browserFrame(p, p.thumb, true)}</figure>

      <div class="case__body">
        <p class="case__lede">${esc(p.description)}</p>
        <div class="case__text">
          ${p.background ? `<h3 class="label">Background</h3><p>${esc(p.background)}</p>` : ''}
          ${p.story ? `<h3 class="label">What I built</h3><p>${esc(p.story)}</p>` : ''}
          <div><a class="btn btn--ink" href="${esc(p.url)}" target="_blank" rel="noopener">Visit the live site ↗</a></div>
        </div>
      </div>

      <div class="case__gallery">
        ${p.gallery.map((src, g) => `<img src="${src}" alt="${esc(p.title)}, section ${g + 1} of the live site" loading="lazy" decoding="async">`).join('')}
      </div>
    </div>

    <button class="case__next" type="button" data-case-step="1">
      <span class="container" style="display:block">
        <span class="label" style="display:block">Next project →</span>
        <span class="case__title" style="display:block">${esc(next.title)}</span>
      </span>
    </button>`
  currentIdx = i
}

export function openCase(slug) {
  const i = projects.findIndex((p) => p.slug === slug)
  if (i < 0) return
  const wasOpen = !el.hidden
  render(i)
  el.scrollTop = 0
  history.replaceState(null, '', `#p-${slug}`)

  if (wasOpen) {
    gsap.fromTo(el.children, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'expo.out' })
    play('whoosh')
    return
  }
  opener = document.activeElement
  el.hidden = false
  stopScroll()
  document.body.style.overflow = 'hidden'
  gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' })
  gsap.fromTo($('.case__head', el).children, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.45, stagger: 0.06, ease: 'expo.out' })
  play('whoosh')
  $('[data-case-close]', el).focus({ preventScroll: true })
}

export function closeCase() {
  if (el.hidden) return
  history.replaceState(null, '', location.pathname + location.search)
  play('drop')
  gsap.to(el, {
    clipPath: 'inset(0% 0% 100% 0%)',
    duration: 0.7,
    ease: 'expo.inOut',
    onComplete: () => {
      el.hidden = true
      el.innerHTML = ''
      document.body.style.overflow = ''
      startScroll()
      opener?.focus?.({ preventScroll: true })
    },
  })
}

const step = (d) => openCase(projects[(currentIdx + d + projects.length) % projects.length].slug)

export function initCase() {
  el = $('[data-case]')

  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-open]')
    if (link) { e.preventDefault(); openCase(link.dataset.open); return }
    if (e.target.closest('[data-case-close]')) closeCase()
    const s = e.target.closest('[data-case-step]')
    if (s) step(Number(s.dataset.caseStep))
  })

  addEventListener('keydown', (e) => {
    if (el.hidden) return
    if (e.key === 'Escape') closeCase()
    if (e.key === 'ArrowRight') step(1)
    if (e.key === 'ArrowLeft') step(-1)
  })

  const fromHash = () => {
    const m = location.hash.match(/^#p-([\w-]+)$/)
    if (m) openCase(m[1])
  }
  addEventListener('hashchange', fromHash)
  return fromHash
}
