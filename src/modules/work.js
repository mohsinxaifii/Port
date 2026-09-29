/* ==================================================================
   WORK - featured cards + the filterable archive list.
   Clicking either opens the case-study overlay (case.js); hovering an
   archive row on desktop shows the WebGL preview (preview.js).
   ================================================================== */

import { gsap } from 'gsap'
import { $, $$, esc, finePointer } from './utils.js'
import { projects } from '../data/projects.js'
import { play } from './sound.js'
import { initPreview } from './preview.js'

export const categoryOf = (p) =>
  p.stack.includes('Shopify') ? 'Shopify' : p.stack.includes('Webflow') ? 'Webflow' : 'Custom build'

export const hostOf = (url) => { try { return new URL(url).host.replace(/^www\./, '') } catch { return url } }

/* A screenshot shown whole inside a slim browser window, with the live
   URL in the bar. Illustrations (`frame: false`) go in bare. The image
   keeps its natural aspect ratio - nothing is cropped. */
export function browserFrame(p, src = p.thumb, eager = false) {
  const img = `<img src="${src}" alt="${esc(p.thumbAlt || `${p.title} homepage`)}" ${eager ? '' : 'loading="lazy" '}decoding="async">`
  if (p.frame === false) return `<div class="browser browser--bare">${img}</div>`
  return `
    <div class="browser">
      <div class="browser__bar" aria-hidden="true">
        <span class="browser__dots"><i></i><i></i><i></i></span>
        <span class="browser__url">${esc(hostOf(p.url))}</span>
      </div>
      ${img}
    </div>`
}

// Put the wordmark's accent treatment on the last word of a title.
const accentTitle = (title) => {
  const words = esc(title).split(' ')
  if (words.length < 2) return `<em>${words[0]}</em>`
  return `${words.slice(0, -1).join(' ')} <em>${words.at(-1)}</em>`
}

export function initWork() {
  const featured = projects.filter((p) => p.featured)
  const archive = projects.filter((p) => !p.featured)

  $('[data-featured]').innerHTML = featured.map((p, i) => `
    <a class="card" href="#p-${p.slug}" data-open="${p.slug}" data-cursor="view" data-reveal style="--d:${(i % 2) * 0.1}s">
      <div class="card__media">
        ${browserFrame(p)}
        <span class="card__badge">${esc(categoryOf(p))}</span>
      </div>
      <div class="card__row">
        <h3 class="card__title">${accentTitle(p.title)}</h3>
        <span class="label">${String(i + 1).padStart(2, '0')}</span>
      </div>
      <p class="card__desc">${esc(p.description)}</p>
      <div class="card__tags">${p.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join('')}</div>
    </a>`).join('')

  $('[data-archive]').innerHTML = archive.map((p, i) => `
    <li>
      <a class="row" href="#p-${p.slug}" data-open="${p.slug}" data-cat="${esc(categoryOf(p))}" data-cursor="open">
        <img class="row__thumb" src="${p.thumb}" alt="" loading="lazy" decoding="async">
        <span class="row__num">${String(featured.length + i + 1).padStart(2, '0')}</span>
        <span class="row__title">${esc(p.title)}</span>
        <span class="row__desc">${esc(p.description)}</span>
        <span class="row__meta">${esc(categoryOf(p))}</span>
        <span class="row__arrow" aria-hidden="true">→</span>
      </a>
    </li>`).join('')

  initFilters(archive)

  const rows = $$('.row')
  rows.forEach((row) => row.addEventListener('mouseenter', () => play('hover')))
  $$('.card').forEach((card) => card.addEventListener('mouseenter', () => play('hover')))

  if (finePointer) {
    const preview = initPreview()
    if (preview) {
      $('[data-archive]').addEventListener('pointerenter', () => {
        preview.preload(archive.map((p) => p.thumb))
      }, { once: true })
      rows.forEach((row) => {
        const p = projects.find((x) => x.slug === row.dataset.open)
        row.addEventListener('mouseenter', () => preview.show(p.thumb))
        row.addEventListener('mouseleave', () => preview.hide())
      })
    }
  }
}

function initFilters(archive) {
  const cats = ['All', ...new Set(archive.map(categoryOf))]
  const count = (c) => (c === 'All' ? archive.length : archive.filter((p) => categoryOf(p) === c).length)
  const mount = $('[data-filters]')
  mount.innerHTML = cats.map((c, i) => `
    <button class="chip${i === 0 ? ' is-active' : ''}" type="button" data-filter="${esc(c)}" aria-pressed="${i === 0}">
      ${esc(c)}<sup>${count(c)}</sup>
    </button>`).join('')

  mount.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]')
    if (!btn) return
    const cat = btn.dataset.filter
    $$('.chip', mount).forEach((b) => {
      b.classList.toggle('is-active', b === btn)
      b.setAttribute('aria-pressed', String(b === btn))
    })
    const shown = []
    $$('.row').forEach((row) => {
      const on = cat === 'All' || row.dataset.cat === cat
      row.classList.toggle('is-hidden', !on)
      if (on) shown.push(row)
    })
    gsap.fromTo(shown, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.035, ease: 'expo.out' })
    play('click')
  })
}
