import '../styles/base.css'
import '../styles/layout.css'
import '../styles/case.css'

import { site } from '../data/site.js'
import { projectBySlug, nextProject } from '../data/projects.js'
import { navMarkup, footerMarkup, cardMarkup, swap, esc } from './partials.js'

import { initViewportUnit } from './viewport.js'
import { initScroll, lockScroll, unlockScroll } from './scroll.js'
import { initNav } from './nav.js'
import { initFitText } from './fit.js'
import { initIntro, initReveals } from './reveal.js'

const mount = (sel, html) => { const el = document.querySelector(sel); if (el) el.innerHTML = html }

const slug = document.body.dataset.slug
const project = projectBySlug(slug)

if (!project) {
  // A generated page whose data entry was deleted - fail visibly, not silently.
  document.body.innerHTML = '<p style="padding:4vw;font:1.4vw serif">Project not found.</p>'
} else {
  mount('[data-nav-mount]', navMarkup('/work.html'))
  mount('[data-footer-mount]', footerMarkup())

  mount('[data-case-meta]', `
    <span>Client: ${esc(project.client)}</span>
    <span>&bull;</span>
    <span>${esc(project.year)}</span>
  `)
  mount('[data-case-title]', swap(project.title))
  mount('[data-case-intro]', esc(project.description))

  mount('[data-case-facts]', [
    ['Role', esc(project.role)],
    ['Year', esc(project.year)],
    project.stack?.length ? ['Stack', project.stack.map(esc).join(', ')] : null,
    project.url
      ? ['Live', `<a href="${esc(project.url)}" target="_blank" rel="noopener noreferrer">Visit site</a>`]
      : null,
  ].filter(Boolean).map(([key, value]) => `
    <div class="fact">
      <span class="fact__key">${key}</span>
      <span class="fact__value">${value}</span>
    </div>
  `).join(''))

  mount('[data-case-background-title]', swap('Background'))
  mount('[data-case-background]', esc(project.background))
  mount('[data-case-story-title]', swap('The Story'))
  mount('[data-case-story]', esc(project.story))

  // Three empty plates hold the gallery's shape until real images land.
  const gallery = project.gallery?.length
    ? project.gallery.map((src, i) => `
        <figure class="plate" data-reveal>
          <img src="${esc(src)}" alt="${esc(project.title)} — image ${i + 1}" loading="lazy">
        </figure>`).join('')
    : Array.from({ length: 3 }, () => `
        <div class="plate placeholder plate--empty" data-reveal><span>Image</span></div>`).join('')
  mount('[data-case-gallery]', gallery)

  const next = nextProject(slug)
  mount('[data-case-next]', `
    <div class="case__next-label">${swap('Next project')}</div>
    ${cardMarkup(next)}
  `)

  document.title = `${site.wordmark} — ${project.title}`

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
}
