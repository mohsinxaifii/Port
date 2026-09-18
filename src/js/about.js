import '../styles/base.css'
import '../styles/layout.css'
import '../styles/home.css'
import '../styles/about.css'

import { site } from '../data/site.js'
import {
  bio, availability, recognition, experience, education, skills, press, clients,
} from '../data/cv.js'
import { navMarkup, footerMarkup, swap, esc } from './partials.js'

import { initViewportUnit } from './viewport.js'
import { initScroll, lockScroll, unlockScroll } from './scroll.js'
import { initNav } from './nav.js'
import { initFitText } from './fit.js'
import { initIntro, initReveals } from './reveal.js'

const $ = (sel) => document.querySelector(sel)
const mount = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html }

/** Hide a whole section when its data array is empty. */
const showIf = (sel, list) => { if (!list.length) $(sel)?.remove() }

mount('[data-nav-mount]', navMarkup('/about.html'))
mount('[data-footer-mount]', footerMarkup())

mount('[data-about-title]', swap('About'))
mount('[data-bio-lead]', swap('Selected'))
mount('[data-bio-emphasis]', swap('Story!'))
mount('[data-bio-copy]', esc(bio.long))

mount('[data-skills-mount]', skills.map((s) => `
  <div class="skill" data-reveal>
    <span class="skill__group">${esc(s.group)}</span>
    <span class="skill__items">${s.items.map(esc).join(', ')}</span>
  </div>
`).join(''))

/* --- Recognition --- */
showIf('[data-recognition-section]', recognition)
mount('[data-recognition-heading]', swap('Recognition'))
mount('[data-recognition-mount]', recognition.map((r) => `
  <div class="row" data-reveal>
    <span class="row__period">${esc(r.year)}</span>
    <div>
      <div class="row__title">${swap(r.org)}</div>
    </div>
    <div class="row__meta">${esc(r.detail)}</div>
  </div>
`).join(''))

/* --- Experience --- */
mount('[data-experience-heading]', swap('Experience'))
mount('[data-experience-mount]', experience.map((e) => `
  <div class="row" data-reveal>
    <span class="row__period">${esc(e.from)}&ndash;${esc(e.to)}</span>
    <div>
      <div class="row__title">${swap(e.role)}</div>
      <div class="row__org">${esc(e.org)}</div>
      ${e.summary ? `<div class="row__summary">${esc(e.summary)}</div>` : ''}
    </div>
    <div class="row__meta">
      ${e.current ? '<span class="row__now">Current</span><br>' : ''}
      ${e.clients?.length ? esc(e.clients.join(', ')) : ''}
    </div>
  </div>
`).join(''))

/* --- Education --- */
showIf('[data-education-section]', education)
mount('[data-education-heading]', swap('Education'))
mount('[data-education-mount]', education.map((e) => `
  <div class="row" data-reveal>
    <span class="row__period">${esc(e.from)}&ndash;${esc(e.to)}</span>
    <div>
      <div class="row__title">${swap(e.qualification)}</div>
      <div class="row__org">${esc(e.org)}</div>
    </div>
    <div class="row__meta"></div>
  </div>
`).join(''))

/* --- Availability --- */
mount('[data-available-mount]', `
  <div>
    <h2 class="display">${swap(availability.headline)}</h2>
    <h2 class="display display--emphasis">${swap(availability.emphasis)}</h2>
  </div>
  <div>
    <span class="available__status">${esc(availability.status)}</span>
    <p class="available__body">
      ${esc(availability.body)}
      <a class="under" href="mailto:${esc(site.email)}">${esc(availability.linkLabel)}</a>.
    </p>
  </div>
`)

/* --- Press --- */
showIf('[data-press-section]', press)
mount('[data-press-heading]', swap('Press & Talks'))
mount('[data-press-mount]', press.map((p) => `
  <li>
    <a class="press" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" data-reveal>
      <span class="press__num"></span>
      <span class="press__title">${esc(p.title)}</span>
      <span class="press__source">${swap(p.source)}</span>
      <span class="press__year">${esc(p.year)}</span>
    </a>
  </li>
`).join(''))

/* --- Clients --- */
mount('[data-clients-mount]', clients.map((c) => `
  <span class="client" data-reveal>${swap(c)}</span>
`).join(''))

document.title = `${site.wordmark} — About`

initViewportUnit()
initScroll()
initNav()
const refreshReveals = initReveals()
initFitText()

lockScroll()
initIntro({
  onComplete: () => {
    unlockScroll()
    refreshReveals()
  },
})
