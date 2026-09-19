import '../styles/base.css'
import '../styles/layout.css'
import '../styles/home.css'

import { site, counters } from '../data/site.js'
import { featuredProjects, upcomingProject } from '../data/projects.js'
import { testimonials } from '../data/cv.js'

import {
  navMarkup, footerMarkup, cardMarkup, headlineMarkup,
  stampMarkup, arrowMarkup, swap, esc,
} from './partials.js'

import { initViewportUnit } from './viewport.js'
import { initScroll, lockScroll, unlockScroll } from './scroll.js'
import { initNav } from './nav.js'
import { initFitText } from './fit.js'
import { initIntro, initReveals } from './reveal.js'

const $ = (sel) => document.querySelector(sel)
const mount = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html }
const text = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html }

/* ------------------------------------------------------------------
   Render
------------------------------------------------------------------ */

mount('[data-nav-mount]', navMarkup('/'))
mount('[data-footer-mount]', footerMarkup())

// Three blocks: one project, the headline, one project.
const lead = featuredProjects.slice(0, 2)
mount('[data-featured-mount]', [
  lead[0] ? cardMarkup(lead[0]) : '',
  headlineMarkup({
    title: 'All Work!',
    desc: 'A featured selection —\nthe latest work\nof the last years.',
    tip: 'Click a project to explore',
  }),
  lead[1] ? cardMarkup(lead[1]) : '',
].join(''))

text('[data-wordmark]', swap(site.wordmark))
text('[data-headline-lead]', swap(site.headline.lead))
text('[data-headline-emphasis]', swap(site.headline.emphasis))
text('[data-intro-copy]', esc(site.intro))

mount('[data-roles-mount]', [
  ...site.roles.map((r) => `<h2 class="role" data-reveal>${swap(r)}</h2>`),
  `<h2 class="role role--place" data-reveal>based in
     <span class="under">${esc(site.location)}</span>.</h2>`,
].join(''))

mount('[data-portrait-mount]', site.portrait
  ? `<img class="intro__portrait" src="${esc(site.portrait)}"
          alt="${esc(site.fullName)}" data-reveal>`
  : `<div class="placeholder intro__portrait" data-reveal><span>Portrait</span></div>`)

// The smaller cut-out that sits between the headline and the drop-cap.
mount('[data-figure-mount]', site.figure
  ? `<img class="intro__figure" src="${esc(site.figure)}" alt="" aria-hidden="true" data-reveal>`
  : '')

mount('[data-stamp-mount]', stampMarkup())

mount('[data-upcoming-text]', headlineMarkup({
  title: 'Upcoming Next',
  desc: 'Fresh entry — a selected\nwork from the latest\nreleases.',
  tip: 'Click the image to explore',
  href: null,
  bare: true,
}))

mount('[data-upcoming-card]', cardMarkup(upcomingProject))

mount('[data-process-figure]', site.processFigure
  ? `<img src="${esc(site.processFigure)}" alt="" aria-hidden="true" data-reveal>`
  : '<div class="placeholder" data-reveal><span>Figure</span></div>')

text('[data-process-lead]', swap(site.process.lead))
text('[data-process-emphasis]', swap(site.process.emphasis))
text('[data-process-intro]', esc(site.process.intro))
text('[data-process-body]', esc(site.process.body))
mount('[data-cta]', `
  <span class="headline__wrap headline__wrap--drawn">
    <span class="cta__text">${swap('All Work')}</span>
    <svg class="headline__doodle" viewBox="0 0 220 90" preserveAspectRatio="none">
      <ellipse cx="110" cy="45" rx="104" ry="38"></ellipse>
    </svg>
  </span>
`)

mount('[data-counters-mount]', counters.map((c) => `
  <div class="counter" data-reveal>
    <div>
      <div class="counter__label">${esc(c.label)}</div>
      <div class="counter__title">${swap(c.title)}</div>
    </div>
    <div class="counter__value">${esc(c.value)}</div>
  </div>
`).join(''))

/* The cut-outs that punctuated these rows were photographs of the designer
   whose site this layout was replicated from, so they are gone. The words
   carry the block on their own; drop your own cut-outs back in as
   <img class="slab__figure"> if you want the punctuation. */
mount('[data-slab-mount]', `
  <div class="slab__row" data-reveal>
    <span class="slab__word">${swap(site.slab.one)}</span>
    <span class="slab__word">${swap(site.slab.two)}</span>
  </div>
  <div class="slab__row" data-reveal>
    <span class="slab__word slab__word--outline">${swap(site.slab.three)}</span>
  </div>
  <div class="slab__row" data-reveal>
    <span class="slab__word">${swap(site.slab.four)}</span>
  </div>
`)

mount('[data-slab-side]', `
  <p data-reveal>${esc(site.slabBody.before)}<a class="under" href="/about.html">${esc(site.slabBody.link)}</a>${esc(site.slabBody.after)}</p>
  <h2 class="slab__aww" data-reveal>${swap(site.slabBody.heading)}</h2>
  <p data-reveal>${esc(site.slabBody.tail)}</p>
`)

const quoteMark = `
  <svg class="quote__mark" viewBox="0 0 40 30" aria-hidden="true">
    <path d="M0 30V16C0 7 5 1 15 0v6c-5 1-8 4-8 9h8v15H0zm25 0V16C25 7 30 1 40 0v6c-5 1-8 4-8 9h8v15H25z"
          fill="currentColor"/>
  </svg>
`

/* No testimonials yet, so the whole band goes - about.js hides its empty
   sections the same way. Without this the index keeps a tall strip of blank
   paper where the deck used to be. Add entries to cv.js and it returns. */
if (!testimonials.length) $('.quotes')?.remove()

mount('[data-quotes-mount]', testimonials.map((t) => {
  const initials = t.name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const avatar = t.avatar
    ? `<img class="quote__avatar" src="${esc(t.avatar)}" alt="${esc(t.name)}" loading="lazy">`
    : `<div class="quote__avatar quote__avatar--empty">${esc(initials)}</div>`
  const org = t.org
    ? ` at ${t.orgUrl
        ? `<a href="${esc(t.orgUrl)}" target="_blank" rel="noopener noreferrer">${esc(t.org)}</a>`
        : esc(t.org)}`
    : ''
  return `
    <figure class="quote" data-reveal>
      <div>
        ${quoteMark}
        <blockquote class="quote__text">&ldquo;${esc(t.quote)}&rdquo;</blockquote>
      </div>
      <figcaption class="quote__by">
        ${avatar}
        <div>
          <div class="quote__name">${swap(t.name)}</div>
          <div class="quote__role">${esc(t.role)}${org}</div>
        </div>
      </figcaption>
    </figure>
  `
}).join(''))

// The strip that closes the page: a card either side of a headline.
const stripCards = featuredProjects.slice(0, 2)
mount('[data-strip-mount]', [
  stripCards[0] ? cardMarkup(stripCards[0]) : '',
  headlineMarkup({
    title: 'All Work!',
    desc: 'Handpicked highlights —\nspanning the last few\nyears.',
    tip: 'Click the sides to explore',
  }),
  stripCards[1] ? cardMarkup(stripCards[1]) : '',
].join(''))

document.title = `${site.wordmark} — Index`

/* ------------------------------------------------------------------
   Behaviour
------------------------------------------------------------------ */

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
