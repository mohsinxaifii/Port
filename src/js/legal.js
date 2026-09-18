import '../styles/base.css'
import '../styles/layout.css'
import '../styles/home.css'

import { site } from '../data/site.js'
import { navMarkup, footerMarkup, swap, esc } from './partials.js'
import { initViewportUnit } from './viewport.js'
import { initScroll } from './scroll.js'
import { initNav } from './nav.js'
import { initFitText } from './fit.js'

const mount = (sel, html) => { const el = document.querySelector(sel); if (el) el.innerHTML = html }

/* Plain-language notice. Replace with your own wording, or with text
   from a lawyer if you start taking client work through the site. */
const clauses = [
  {
    title: 'Ownership',
    body:
      'All content on this site — text, imagery, code and design — belongs to ' +
      `${site.fullName} unless credited otherwise. Client work is shown with permission ` +
      'and remains the property of the respective client.',
  },
  {
    title: 'Analytics',
    body:
      'This site ships no third-party analytics, advertising or tracking cookies. ' +
      'If that changes, this notice will be updated first.',
  },
  {
    title: 'Contact',
    body:
      `Questions about anything here go to ${site.email}.`,
  },
]

mount('[data-nav-mount]', navMarkup('/legal.html'))
mount('[data-footer-mount]', footerMarkup())
mount('[data-legal-title]', swap('Legal'))

mount('[data-legal-mount]', clauses.map((c) => `
  <article class="legal__clause">
    <h2 class="legal__title">${swap(c.title)}</h2>
    <p class="legal__body">${esc(c.body)}</p>
  </article>
`).join(''))

document.title = `${site.wordmark} — Legal`

initViewportUnit()
initScroll()
initNav()
initFitText()
